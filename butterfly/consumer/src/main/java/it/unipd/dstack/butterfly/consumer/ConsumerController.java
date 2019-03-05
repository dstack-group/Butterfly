package it.unipd.dstack.butterfly.consumer;

import it.unipd.dstack.butterfly.config.ConfigManager;
import it.unipd.dstack.butterfly.config.KafkaPropertiesFactory;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.Duration;
import java.util.Arrays;
import java.util.function.Consumer;

public class ConsumerController <K, V> {

    private static final Logger logger = LoggerFactory.getLogger(ConsumerController.class);
    private String topic;
    private KafkaConsumer<K, V> consumer;
    private boolean startConsumer = true;

    public ConsumerController(String topic) {
        this.topic = topic;

        this.consumer = new KafkaConsumer<>(KafkaPropertiesFactory.defaultKafkaConsumerPropertiesFactory());
        consumer.subscribe(Arrays.asList(topic));
        logger.info("Subscribed to topics " + Arrays.asList(topic));
    }

    // starts the consumer
    public void start(Consumer<V> onMessageConsume) {
        int pollDurationMs = ConfigManager.getIntProperty("KAFKA_POLL_DURATION_MS", 2000);
        while (startConsumer) {
            ConsumerRecords<K, V> records = consumer.poll(Duration.ofMillis(pollDurationMs));
            logger.info("Consumer received " + records.count() + " records");
            for (ConsumerRecord<K, V> record : records) {
                onMessageConsume.accept(record.value());
                logger.info("@@ accepted record {0}", record.value());
            }
        }
    }

    // stops the consumer
    public void stop() {
        startConsumer = false;
        consumer.close();
    }
}
