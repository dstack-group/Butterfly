package it.unipd.dstack.butterfly.producer.gitlab;

import it.unipd.dstack.butterfly.common.config.ConfigManager;
import it.unipd.dstack.butterfly.common.config.EnvironmentConfigManager;
import it.unipd.dstack.butterfly.producer.avro.Event;
import it.unipd.dstack.butterfly.producer.producer.*;

public class Main {
    public static void main(String[] args) {
        ConfigManager configManager = new EnvironmentConfigManager();
        Producer<Event> producer = new ProducerImpl<>(configManager);
        OnWebhookEventFromTopic<Event> onWebhookEventFromTopic = new OnWebhookEventFromTopicImpl<>();

        GitlabProducerController gitlabProducerController =
                new GitlabProducerController(configManager, producer, onWebhookEventFromTopic);
        gitlabProducerController.start();
    }
}
