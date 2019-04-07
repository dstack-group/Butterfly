package it.unipd.dstack.butterfly.consumer.consumer;

import it.unipd.dstack.butterfly.config.AbstractConfigManager;
import it.unipd.dstack.butterfly.controller.record.Record;
import it.unipd.dstack.butterfly.consumer.utils.ConsumerUtils;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.Duration;
import java.util.List;
import java.util.Properties;

public class ConsumerImpl <V> extends AbstractSubject<V> implements Consumer<V> {
    private static final Logger logger = LoggerFactory.getLogger(ConsumerImpl.class);

    private final AbstractConfigManager configManager;
    private List<String> topicList;
    private KafkaConsumer<String, V> kafkaConsumer;
    private final Duration pollDuration;
    private boolean startConsumer = true;

    public ConsumerImpl(AbstractConfigManager configManager) {
        this.configManager = configManager;
        this.kafkaConsumer = ConsumerImpl.createKafkaConsumer(configManager);

        int pollDurationMs = configManager.getIntProperty("KAFKA_POLL_DURATION_MS", 2000);
        this.pollDuration = Duration.ofMillis(pollDurationMs);
    }

    private static <K, V> KafkaConsumer<K, V> createKafkaConsumer(AbstractConfigManager configManager) {
        Properties properties = KafkaConsumerProperties.defaultKafkaConsumerPropertiesFactory(configManager);
        return new KafkaConsumer<>(properties);
    }

    /**
     * Subscribes to the given list of topics to get dynamically assigned partitions.
     *
     * @param topicList
     */
    @Override
    public void subscribe(List<String> topicList) {
        this.topicList = topicList;
        this.kafkaConsumer.subscribe(topicList);
    }

    @Override
    public void start() {
        while (this.startConsumer) {
            try {
                ConsumerRecords<String, V> consumerRecordList = kafkaConsumer.poll(this.pollDuration);
                List<Record<V>> recordList = ConsumerUtils.consumerRecordsToList(consumerRecordList);

                recordList.forEach(super::notifyObservers);

            } catch (Exception e) {
                logger.error("Error consuming from dispatcher: " + e.getMessage() + " " + e.getStackTrace());
            }
        }
    }

    /**
     * Releases any system resources associated with the current object.
     */
    @Override
    public void close() {
        this.startConsumer = false;
        this.kafkaConsumer.close();
        super.removeObservers();
    }
}
