package it.unipd.dstack.butterfly.consumer.consumer;

import io.confluent.kafka.serializers.AbstractKafkaAvroSerDeConfig;
import io.confluent.kafka.serializers.KafkaAvroDeserializer;
import it.unipd.dstack.butterfly.config.AbstractConfigManager;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;

import java.util.Properties;

import static io.confluent.kafka.serializers.KafkaAvroDeserializerConfig.SPECIFIC_AVRO_READER_CONFIG;

class KafkaConsumerProperties {
    private KafkaConsumerProperties() {}

    static Properties defaultKafkaConsumerPropertiesFactory(AbstractConfigManager configManager) {
        Properties props = new Properties();

        // A list of URLs to use for establishing the initial connection to the cluster.
        props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG,
                configManager.getStringProperty("KAFKA_BOOTSTRAP_SERVERS_CONFIG"));

        props.put(ConsumerConfig.GROUP_ID_CONFIG,
                configManager.getStringProperty("KAFKA_GROUP_ID_CONFIG"));

        props.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG,
                configManager.getStringProperty("KAFKA_AUTO_OFFSET_RESET_CONFIG", "earliest"));

        props.put(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG,
                configManager.getBooleanProperty("KAFKA_ENABLE_AUTO_COMMIT_CONFIG", false));

        props.put(ConsumerConfig.MAX_POLL_RECORDS_CONFIG,
                configManager.getIntProperty("KAFKA_MAX_POLL_RECORDS_CONFIG", 10));

        // Deserializer class for key that implements the
        // org.apache.kafka.common.serialization.Deserializer interface.
        props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG,
                StringDeserializer.class.getName());

        // Deserializer class for value that implements the
        // org.apache.kafka.common.serialization.Deserializer interface.
        props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG,
                KafkaAvroDeserializer.class.getName());

        props.put(SPECIFIC_AVRO_READER_CONFIG, "true");

        props.put(AbstractKafkaAvroSerDeConfig.SCHEMA_REGISTRY_URL_CONFIG,
                configManager.getStringProperty("AVRO_SCHEMA_REGISTRY_URL"));

        return props;
    }
}
