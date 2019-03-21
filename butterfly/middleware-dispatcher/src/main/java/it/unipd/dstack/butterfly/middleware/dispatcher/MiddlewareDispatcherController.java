package it.unipd.dstack.butterfly.middleware.dispatcher;

import it.unipd.dstack.butterfly.config.ConfigManager;
import it.unipd.dstack.butterfly.consumer.avro.EventWithUserContact;
import it.unipd.dstack.butterfly.consumer.utils.ConsumerUtils;
import it.unipd.dstack.butterfly.middleware.dispatcher.model.UserManagerResponse;
import it.unipd.dstack.butterfly.middleware.dispatcher.model.UserManagerResponseData;
import it.unipd.dstack.butterfly.middleware.dispatcher.processor.EventProcessor;
import it.unipd.dstack.butterfly.middleware.dispatcher.utils.Utils;
import it.unipd.dstack.butterfly.producer.avro.Event;
import it.unipd.dstack.butterfly.producer.producer.ProducerImpl;
import org.apache.avro.AvroRuntimeException;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.Consumer;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.Duration;
import java.util.List;

public class MiddlewareDispatcherController {
    private static final Logger logger = LoggerFactory.getLogger(MiddlewareDispatcherController.class);
    private final List<String> topics;
    private String messageTopicPrefix;
    private Consumer<String, Event> consumer;
    private ProducerImpl<EventWithUserContact> producer;
    private EventProcessor eventProcessor;

    MiddlewareDispatcherController() {
        this.messageTopicPrefix = ConfigManager.getStringProperty("MESSAGE_TOPIC_PREFIX");
        String topicsAsCommaString = ConfigManager.getStringProperty("KAFKA_TOPICS");

        this.topics = ConsumerUtils.getListFromCommaSeparatedString(topicsAsCommaString);
        logger.info("Middleware dispatcher reading topics: " + this.topics);
        this.consumer = ConsumerUtils.createConsumer();
        this.consumer.subscribe(this.topics);
        this.producer = new ProducerImpl<>();

        this.setupEventProcessor();
    }

    /**
     * This middleware relies on EventProcessor to communicate with the UserManager REST API in order to get
     * the list of users to notify and their contacts' info.
     */
    private void setupEventProcessor() {
        String userManagerUrl = ConfigManager.getStringProperty("USER_MANAGER_URL");
        int userManagerRequestTimeout = ConfigManager.getIntProperty("USER_MANAGER_REQUEST_TIMEOUT_MS");
        int userManagerThreadsNumber = ConfigManager.getIntProperty("USER_MANAGER_THREADS");
        this.eventProcessor = new EventProcessor.Builder()
                .setUserManagerURL(userManagerUrl)
                .setTimeoutInMs(userManagerRequestTimeout)
                .setThreadsNumber(userManagerThreadsNumber)
                .build();
    }

    /**
     * Starts consuming messages from <code>this.topics</code>.
     */
    void start() {
        int pollDurationMs = ConfigManager.getIntProperty("KAFKA_POLL_DURATION_MS", 2000);
        consumer.subscribe(topics);
        while (true) {
            try {
                ConsumerRecords<String, Event> records = consumer.poll(Duration.ofMillis(pollDurationMs));
                int count = records.count();
                if (count > 0) {
                    logger.info("Received " + count + " records");
                    records.forEach(this::processRecord);
                }
            } catch (Exception e) {
                logger.error("Error consuming from dispatcher: " + e.getMessage() + " " + e.getStackTrace());
            }
        }
    }

    /**
     * Relinquishes process resources
     */
    void close() {
        this.consumer.close();
        this.producer.close();
    }

    private void processRecord(ConsumerRecord<String, Event> record) {
        String topic = record.topic();
        Event event = record.value();
        logger.info("Read message from topic " + topic + ": " + event.toString());
        this.processEvent(event);
    }

    /**
     * Upon receiving an event message, EventProcessor is used to get the original event record augmented with a list
     * of users that should be notified. Each returned user has at least a contact platform of choice.
     *
     * @param event Event record to be processed
     */
    private void processEvent(Event event) {
        eventProcessor.processEvent(event, UserManagerResponse.class)
                .thenAcceptAsync(response -> {
                    if (response == null) {
                        logger.error("Response lost from eventProcessor");
                    } else {
                        logger.info("Response received from eventProcessor: " + response);
                        this.onValidResponse(response, event);
                    }
                })
                .exceptionally(e -> {
                    logger.error("Exception in processEvent: " + e);
                    return null;
                });
    }

    /**
     * @param userManagerResponse Object representing the response obtained by EventProcessor
     * @param event               The original Event record
     */
    private void onValidResponse(UserManagerResponse userManagerResponse, Event event) {
        try {
            UserManagerResponseData data = userManagerResponse.getData();

            /**
             * Extracts every possible association between a user and 1 to N contact platforms, and aggregates this
             * information with the original event.
             */
            logger.info("Trying to parse eventWithUserContactList");
            List<EventWithUserContact> eventWithUserContactList =
                    Utils.parseUserManagerResponseData(data, event);

            /**
             * Creates a new ProducerImpl record for each EventWithUserContact instance in eventWithUserContactList.
             * The destination topic is extracted from the contact platform name.
             */
            logger.info("Trying to assemble producerRecordList");
            var producerRecordList = Utils.processMessageDataList(
                    eventWithUserContactList,
                    this::extractTopicStrategy,
                    Utils::getProducerRecord
            );

            logger.info("Parsed producerRecordList");
            this.producer.send(producerRecordList)
                    .thenAccept((Void v) -> {
                        logger.info("SENT EVERYTHING");
                    })
                    .exceptionally(e -> {
                        logger.error("Couldn't send batch of messages " + e);
                        return null;
                    });
        } catch (AvroRuntimeException e) {
            logger.error("AVRO EXCEPTION " + e.getCause() + " " + e);
        } catch (RuntimeException e) {
            logger.error("Unexpected error while parsing REST API JSON response " + e);
        }
    }

    /**
     * Returns the destination topic from eventWithUserContact's contact platform.
     *
     * @param eventWithUserContact
     * @return the destination topic
     */
    private String extractTopicStrategy(EventWithUserContact eventWithUserContact) {
        return ConsumerUtils.getLowerCaseTopicFromEnum(this.messageTopicPrefix,
                eventWithUserContact.getUserContact().getContact());
    }
}
