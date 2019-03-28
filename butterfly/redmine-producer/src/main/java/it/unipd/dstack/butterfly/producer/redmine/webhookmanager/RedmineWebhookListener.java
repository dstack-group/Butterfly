package it.unipd.dstack.butterfly.producer.redmine.webhookmanager;

public interface RedmineWebhookListener <T> {
    /**
     * Emitted when a new issue has been created.
     * @param event
     */
    void onIssueCreatedEvent(T event);

    /**
     * Emitted when an existing issue has been edited.
     * @param event
     */
    void onIssueEditedEvent(T event);
}
