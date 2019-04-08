package it.unipd.dstack.butterfly.consumer.consumer;

import it.unipd.dstack.butterfly.consumer.consumer.KafkaConsumerProperties;
import it.unipd.dstack.butterfly.config.EnvironmentConfigManager;

import java.util.Properties;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;

public class KafkaConsumerPropertiesTest {


    /**
     *  <p>
     *      Check if the defaultKafkaConsumerPropertiesFactory method returns a Properties object
     *      containing all the KafkaConsumer properties enabled 
     *  <p>
     *
     *  @author DStack Group
     *  @return void
     */

    @Test
    public void shouldReturnAllKafkaConsumerProperties() {
//        Properties props = KafkaConsumerProperties.defaultKafkaConsumerPropertiesFactory(
//            new EnvironmentConfigManager());
//            TODO: ConfigurationUndefined -> There is no variable setted yet
    }
}
