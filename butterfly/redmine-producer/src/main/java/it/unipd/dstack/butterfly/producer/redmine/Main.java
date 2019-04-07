package it.unipd.dstack.butterfly.producer.redmine;

import it.unipd.dstack.butterfly.config.AbstractConfigManager;
import it.unipd.dstack.butterfly.config.EnvironmentConfigManager;
import it.unipd.dstack.butterfly.producer.avro.Event;
import it.unipd.dstack.butterfly.producer.producer.OnWebhookEventFromTopic;
import it.unipd.dstack.butterfly.producer.producer.OnWebhookEventFromTopicImpl;
import it.unipd.dstack.butterfly.producer.producer.Producer;
import it.unipd.dstack.butterfly.producer.producer.ProducerImpl;

public class Main {
    public static void main(String[] args) {
        AbstractConfigManager configManager = new EnvironmentConfigManager();
        Producer<Event> producer = new ProducerImpl<>(configManager);
        OnWebhookEventFromTopic<Event> onWebhookEventFromTopic = new OnWebhookEventFromTopicImpl<>();

        RedmineProducerController redmineProducerController =
                new RedmineProducerController(configManager, producer, onWebhookEventFromTopic);
        redmineProducerController.start();
    }
}
