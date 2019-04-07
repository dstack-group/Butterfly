package it.unipd.dstack.butterfly.producer.gitlab;

import it.unipd.dstack.butterfly.config.AbstractConfigManager;
import it.unipd.dstack.butterfly.config.EnvironmentConfigManager;
import it.unipd.dstack.butterfly.producer.avro.Event;
import it.unipd.dstack.butterfly.producer.producer.*;

public class Main {
    public static void main(String[] args) {
        AbstractConfigManager configManager = new EnvironmentConfigManager();
        Producer<Event> producer = new ProducerImpl<>(configManager);
        OnWebhookEventFromTopic<Event> onWebhookEventFromTopic = new OnWebhookEventFromTopicImpl<>();

        GitlabProducerController gitlabProducerController =
                new GitlabProducerController(configManager, producer, onWebhookEventFromTopic);
        gitlabProducerController.start();
    }
}
