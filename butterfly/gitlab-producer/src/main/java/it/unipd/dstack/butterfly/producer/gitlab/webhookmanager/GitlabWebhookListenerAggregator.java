package it.unipd.dstack.butterfly.producer.gitlab.webhookmanager;

import it.unipd.dstack.butterfly.producer.producer.OnWebhookEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * GitlabWebhookListenerAggregator performs the same single action for every different event
 * of this class that is fired.
 * @param <T>
 */
public class GitlabWebhookListenerAggregator<T> implements GitlabWebhookListener<T> {
    private static final Logger logger = LoggerFactory.getLogger(GitlabWebhookListenerAggregator.class);
    private final OnWebhookEvent<T> onWebhookEvent;

    public GitlabWebhookListenerAggregator(OnWebhookEvent<T> onWebhookEvent) {
        this.onWebhookEvent = onWebhookEvent;
    }

    /**
     * Emitted when a new issue has been created.
     * @param event
     */
    @Override
    public void onIssueCreatedEvent(T event) {
        this.logMessage("onIssueCreatedEvent called %s", event);
        this.onWebhookEvent.handleEvent(event);
    }

    /**
     * Emitted when an existing issue has been edited.
     * @param event
     */
    @Override
    public void onIssueEditedEvent(T event) {
        this.logMessage("onIssueEditedEvent called %s", event);
        this.onWebhookEvent.handleEvent(event);
    }

    /**
     * Emitted when a new commit has been created.
     * @param event
     */
    @Override
    public void onCommitCreatedEvent(T event) {
        this.logMessage("onCommitCreatedEvent called %s", event);
        this.onWebhookEvent.handleEvent(event);
    }

    /**
     * Emitted when a new merge request has been created.
     * @param event
     */
    @Override
    public void onMergeRequestCreatedEvent(T event) {
        this.logMessage("onMergeRequestCreatedEvent called %s", event);
        this.onWebhookEvent.handleEvent(event);
    }

    /**
     * Emitted when an existing merge request has been edited.
     * @param event
     */
    @Override
    public void onMergeRequestEditedEvent(T event) {
        this.logMessage("onMergeRequestEditedEvent called %s", event);
        this.onWebhookEvent.handleEvent(event);
    }

    /**
     * Emitted when an existing merge request has been closed.
     * @param event
     */
    @Override
    public void onMergeRequestClosedEvent(T event) {
        this.logMessage("onMergeRequestClosedEvent called %s", event);
        this.onWebhookEvent.handleEvent(event);
    }

    /**
     * Emitted when an existing merge request has been merged.
     * @param event
     */
    @Override
    public void onMergeRequestMergedEvent(T event) {
        this.logMessage("onMergeRequestMergedEvent called %s", event);
        this.onWebhookEvent.handleEvent(event);
    }

    private void logMessage(String message, T event) {
        if (logger.isInfoEnabled()) {
            logger.info(String.format(message, event));
        }
    }
}
