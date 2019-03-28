package it.unipd.dstack.butterfly.producer.gitlab.webhookmanager;

public interface GitlabWebhookListener <T> {
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

    /**
     * Emitted when a new commit has been created.
     * @param event
     */
    void onCommitCreatedEvent(T event);
}
