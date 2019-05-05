/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    middleware-dispatcher
 * @fileName:  MiddlewareDispatcherController.java
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 * MiddlewareDispatcherController is the core controller of Butterfly. Even though it only extends
 * the ConsumerController class, it actually manages both a consumer and a producer. In fact, it
 * continuously consumes all the messages produced by the topics defined in the KAFKA_TOPICS configuration
 * variabile, then it asks the User Manager which users should receive notifications about the incoming events,
 * and then it produces new messages based on the original event and the User Manager response.
 * The new messages are sent to the contact-{SERVICE} topic, where {SERVICE} is the destination contact service.
 * For example, if a user present in the User Manager response has two contact accounts, one associated with
 * <b>TELEGRAM</b> and one with <b>SLACK</b>, the same event will be sent to the consumers which listen to the
 * <pre>contact-telegram</pre> and the <pre>contact-slack</pre> topics.
 * The incoming event messages are committed only when their aggregate counterpart (the event messages with the
 * user contact info attached) have been successfully produced.
 */

package it.unipd.dstack.butterfly.middleware.dispatcher;

import it.unipd.dstack.butterfly.config.AbstractConfigManager;
import it.unipd.dstack.butterfly.controller.record.Record;
import it.unipd.dstack.butterfly.consumer.avro.EventWithUserContact;
import it.unipd.dstack.butterfly.consumer.consumer.ConsumerFactory;
import it.unipd.dstack.butterfly.consumer.consumer.controller.ConsumerController;
import it.unipd.dstack.butterfly.consumer.utils.ConsumerUtils;
import it.unipd.dstack.butterfly.middleware.dispatcher.model.UserManagerResponse;
import it.unipd.dstack.butterfly.middleware.dispatcher.model.UserManagerResponseData;
import it.unipd.dstack.butterfly.eventprocessor.EventProcessor;
import it.unipd.dstack.butterfly.middleware.dispatcher.utils.Utils;
import it.unipd.dstack.butterfly.producer.avro.Event;
import it.unipd.dstack.butterfly.producer.producer.Producer;
import org.apache.avro.AvroRuntimeException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

public class MiddlewareDispatcherController extends ConsumerController<Event> {
    private static final Logger logger = LoggerFactory.getLogger(MiddlewareDispatcherController.class);
    private String messageTopicPrefix;
    private Producer<EventWithUserContact> producer;
    private EventProcessor eventProcessor;

    MiddlewareDispatcherController(
            AbstractConfigManager configManager,
            Producer<EventWithUserContact> producer,
            ConsumerFactory<Event> consumerFactory
    ) {
        super(
                configManager,
                consumerFactory,
                MiddlewareDispatcherController.getKafkaTopicList(configManager.getStringProperty("KAFKA_TOPICS"))
        );
        this.messageTopicPrefix = configManager.getStringProperty("MESSAGE_TOPIC_PREFIX");
        this.producer = producer;

        this.setupEventProcessor();
    }

    /**
     * Called when a new record is received from the broker.
     *
     * @param record
     */
    @Override
    protected void onMessageConsume(Record<Event> record) {
        String topic = record.getTopic();
        Event event = record.getData();
        logger.info("Read message from topic " + topic + ": " + event.toString());
        this.processEvent(event);
    }

    /**
     * Releases MiddlewareDispatcherController's resources
     */
    @Override
    protected void releaseResources() {
        this.producer.close();
    }

    private static List<String> getKafkaTopicList(String kafkaTopics) {
        return ConsumerUtils.getListFromCommaSeparatedString(kafkaTopics);
    }

    /**
     * This middleware relies on EventProcessor to communicate with the UserManager REST API in order to get
     * the list of users to notify and their contacts' info.
     */
    private void setupEventProcessor() {
        String userManagerUrl = this.configManager.getStringProperty("USER_MANAGER_URL");
        int userManagerRequestTimeout = this.configManager.getIntProperty("USER_MANAGER_REQUEST_TIMEOUT_MS");
        int userManagerThreadsNumber = this.configManager.getIntProperty("USER_MANAGER_THREADS");
        this.eventProcessor = new EventProcessor.Builder()
                .setUserManagerURL(userManagerUrl)
                .setTimeoutInMs(userManagerRequestTimeout)
                .setThreadsNumber(userManagerThreadsNumber)
                .build();
    }

    /**
     * Upon receiving an event message, EventProcessor is used to get the original event record augmented with a list
     * of users that should be notified. Each returned user has at least a contact platform of choice.
     *
     * @param event Event record to be processed
     */
    private void processEvent(Event event) {
        logger.info(String.format("Processing event in thread %s", Thread.currentThread().getId()));
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
            logger.info(String.format("Parsing valid response in thread %s", Thread.currentThread().getId()));
            List<UserManagerResponseData> data = userManagerResponse.getData();

            /**
             * Extracts every possible association between a user and 1 to N contact platforms, and aggregates this
             * information with the original event.
             */
            logger.info("Trying to parse eventWithUserContactList " + data);
            List<EventWithUserContact> eventWithUserContactList =
                    Utils.parseUserManagerResponseData(data, event);

            /**
             * Creates a new ProducerImpl record for each EventWithUserContact instance in eventWithUserContactList.
             * The destination topic is extracted from the contact platform name.
             */
            logger.info("Trying to assemble producerRecordList");
            var producerRecordList = Utils.processMessageDataList(
                    eventWithUserContactList,
                    Utils.extractTopicStrategy(this.messageTopicPrefix),
                    Utils::getProducerRecord
            );

            logger.info(String.format("Parsed producerRecordList in thread %s", Thread.currentThread().getId()));
            this.producer.send(producerRecordList)
                    .thenAccept((Void v) -> {
                        logger.info("SENT EVERYTHING, NOW COMMITTING");
                        this.consumer.commitSync();
                    })
                    .exceptionally(e -> {
                        logger.error("Couldn't sendMessage batch of messages " + e);
                        return null;
                    });
        } catch (AvroRuntimeException e) {
            logger.error("AVRO EXCEPTION " + e.getCause() + " " + e);
        } catch (RuntimeException e) {
            logger.error("Unexpected error while parsing REST API JSON response " + e);
        }
    }
}
