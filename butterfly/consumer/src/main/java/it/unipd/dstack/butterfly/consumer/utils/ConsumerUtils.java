package it.unipd.dstack.butterfly.consumer.utils;

import io.confluent.kafka.serializers.KafkaAvroDeserializer;
import it.unipd.dstack.butterfly.config.ConfigManager;
import it.unipd.dstack.butterfly.config.record.Record;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Properties;

import static io.confluent.kafka.serializers.AbstractKafkaAvroSerDeConfig.SCHEMA_REGISTRY_URL_CONFIG;
import static io.confluent.kafka.serializers.KafkaAvroDeserializerConfig.SPECIFIC_AVRO_READER_CONFIG;
import static org.apache.kafka.clients.consumer.ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG;
import static org.apache.kafka.clients.consumer.ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG;

public final class ConsumerUtils {
    private ConsumerUtils() {
    }

    public static <T> List<T> getListFromSingleton(T single) {
        return Arrays.asList(single);
    }

    public static <T> List<Record<T>> consumerRecordsToList(ConsumerRecords<String, T> consumerRecordList) {
        List<Record<T>> recordList = new ArrayList<>();
        consumerRecordList.iterator().forEachRemaining(consumerRecord -> {
            recordList.add(new Record<>(consumerRecord.topic(), consumerRecord.value()));
        });
        return recordList;
    }

    /**
     * Utility to retrieve a list of topics from a single string.
     * Example:
     * commaSeparatedValue: "TOPIC_1,TOPIC2,TOPIC3"
     * result: {"TOPIC_1", "TOPIC_2", "TOPIC_3"}
     *
     * @param commaSeparatedValue
     * @return
     */
    public static List<String> getListFromCommaSeparatedString(String commaSeparatedValue) {
        return Arrays.asList(commaSeparatedValue.split(","));
    }

    /**
     * Given a topic prefix string and an enum representing a service,
     * it returns a combination of the two elements. The result is guaranteed to be lowercase.
     *
     * @param topicPrefix
     * @param service
     * @return
     */
    public static String getLowerCaseTopicFromEnum(String topicPrefix, Enum service) {
        String topicPostfix = service.toString();
        return String.format("%s%s", topicPrefix, topicPostfix).toLowerCase();
    }

    /**
     * Returns a Kafka Consumer
     * @param <V>
     * @return
     */
    public static <V> KafkaConsumer<String, V> createConsumer() {
        Properties props = new Properties();

        // A list of URLs to use for establishing the initial connection to the cluster.
        props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG,
                ConfigManager.getStringProperty("KAFKA_BOOTSTRAP_SERVERS_CONFIG"));
        props.put(ConsumerConfig.GROUP_ID_CONFIG,
                ConfigManager.getStringProperty("KAFKA_GROUP_ID_CONFIG"));
        props.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG,
                ConfigManager.getStringProperty("KAFKA_AUTO_OFFSET_RESET_CONFIG", "earliest"));

        /**
         * For the moment this should default to true. this.consumer.commitSync() will throw a
         * ConcurrentModificationException even if handled in a synchronized block. This will be inspected further
         * during the RQ phase of the project.
         */
        props.put(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG,
                ConfigManager.getBooleanProperty("KAFKA_ENABLE_AUTO_COMMIT_CONFIG", true));

        props.put(ConsumerConfig.MAX_POLL_RECORDS_CONFIG,
                ConfigManager.getIntProperty("KAFKA_MAX_POLL_RECORDS_CONFIG", 10));
        props.put(KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class.getName());
        props.put(VALUE_DESERIALIZER_CLASS_CONFIG, KafkaAvroDeserializer.class.getName());
        props.put(SPECIFIC_AVRO_READER_CONFIG, "true");
        props.put(SCHEMA_REGISTRY_URL_CONFIG,
                ConfigManager.getStringProperty("AVRO_SCHEMA_REGISTRY_URL", "http://localhost:8081"));
        KafkaConsumer<String, V> consumer = new KafkaConsumer<>(props);

        return consumer;
    }
}
