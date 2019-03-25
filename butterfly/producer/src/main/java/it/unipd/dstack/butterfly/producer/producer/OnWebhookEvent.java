package it.unipd.dstack.butterfly.producer.producer;

@FunctionalInterface
public interface OnWebhookEvent <T> {
    /**
     * This method is called when a WebHook event has been received. The event object has info about the
     * specific event type and its data.
     * @param event
     */
    void handleEvent(T event);
}
