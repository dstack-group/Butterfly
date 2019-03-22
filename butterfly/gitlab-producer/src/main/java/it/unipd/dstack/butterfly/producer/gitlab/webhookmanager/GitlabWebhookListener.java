package it.unipd.dstack.butterfly.producer.gitlab.webhookmanager;

import it.unipd.dstack.butterfly.producer.avro.Event;

@FunctionalInterface
public interface GitlabWebhookListener {
    /**
     * This method is called when a WebHook event has been received. The event object has info about the
     * specific event type and its data.
     * @param event
     */
    void handleEvent(Event event);
}
