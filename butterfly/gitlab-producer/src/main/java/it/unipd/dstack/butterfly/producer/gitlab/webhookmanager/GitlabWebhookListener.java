package it.unipd.dstack.butterfly.producer.gitlab.webhookmanager;

import it.unipd.dstack.butterfly.producer.avro.Event;

public interface GitlabWebhookListener {

    /**
     * This method is called when a WebHook merge request event has been received.
     * Not currently supported.
     *
     * @param event the Event instance containing info about the merge request event
     */
    // void handleMergeRequestEvent(Event event);

    /**
     * This method is called when a WebHook push event has been received.
     *
     * @param event the Event instance containing info about the push event
     */
    void handlePushEvent(Event event);

    /**
     * This method is called when a WebHook issue event has been received.
     *
     * @param event the Event instance containing info about the issue event
     */
    void handleIssueEvent(Event event);
}
