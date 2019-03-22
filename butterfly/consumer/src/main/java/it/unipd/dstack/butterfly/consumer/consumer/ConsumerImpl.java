package it.unipd.dstack.butterfly.consumer.consumer;

import it.unipd.dstack.butterfly.config.ConfigManager;
import it.unipd.dstack.butterfly.config.record.Record;
import it.unipd.dstack.butterfly.consumer.utils.ConsumerUtils;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.Duration;
import java.util.List;

public class ConsumerImpl <V> implements Consumer {
    private static final Logger logger = LoggerFactory.getLogger(ConsumerImpl.class);
    private List<String> topicList;
    private KafkaConsumer<String, V> kafkaConsumer;
    private final Duration pollDuration;
    private final OnConsumedMessage<V> onConsumedMessage;
    private boolean startConsumer = true;

    public ConsumerImpl(OnConsumedMessage<V> onConsumedMessage) {
        this.onConsumedMessage = onConsumedMessage;
        this.kafkaConsumer = ConsumerUtils.createConsumer();

        int pollDurationMs = ConfigManager.getIntProperty("KAFKA_POLL_DURATION_MS", 2000);
        this.pollDuration = Duration.ofMillis(pollDurationMs);
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

                recordList.forEach(this.onConsumedMessage::apply);

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
    }
}
