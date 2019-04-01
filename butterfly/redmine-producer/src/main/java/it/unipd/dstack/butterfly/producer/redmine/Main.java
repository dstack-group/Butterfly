package it.unipd.dstack.butterfly.producer.redmine;

import it.unipd.dstack.butterfly.producer.avro.Event;
import it.unipd.dstack.butterfly.producer.producer.OnWebhookEventFromTopic;
import it.unipd.dstack.butterfly.producer.producer.OnWebhookEventFromTopicImpl;
import it.unipd.dstack.butterfly.producer.producer.Producer;
import it.unipd.dstack.butterfly.producer.producer.ProducerImpl;

public class Main {
    public static void main(String[] args) {
        Producer<Event> producer = new ProducerImpl<>();
        OnWebhookEventFromTopic<Event> onWebhookEventFromTopic = new OnWebhookEventFromTopicImpl<>();

        RedmineProducerController redmineProducerController = new RedmineProducerController(producer, onWebhookEventFromTopic);
        redmineProducerController.start();
    }
}
