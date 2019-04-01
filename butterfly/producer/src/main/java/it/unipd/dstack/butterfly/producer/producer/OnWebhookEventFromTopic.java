package it.unipd.dstack.butterfly.producer.producer;

@FunctionalInterface
public interface OnWebhookEventFromTopic <T> {
    /**
     * This method is called when a WebHook event has been received. This method applies currying.
     *
     * @param producer the producer implementation that needs to send the enclosed event in the given topic.
     * @param topic the name of the topic where the record of the given event will be sent.
     */
    OnWebhookEvent<T> onEvent(Producer<T> producer, String topic);
}
