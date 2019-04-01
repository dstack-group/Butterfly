package it.unipd.dstack.butterfly.producer.gitlab;

import it.unipd.dstack.butterfly.producer.avro.Event;
import it.unipd.dstack.butterfly.producer.producer.*;

public class Main {
    public static void main(String[] args) {
        Producer<Event> producer = new ProducerImpl<>();
        OnWebhookEventFromTopic<Event> onWebhookEventFromTopic = new OnWebhookEventFromTopicImpl<>();

        GitlabProducerController gitlabProducerController = new GitlabProducerController(producer, onWebhookEventFromTopic);
        gitlabProducerController.start();
    }
}
