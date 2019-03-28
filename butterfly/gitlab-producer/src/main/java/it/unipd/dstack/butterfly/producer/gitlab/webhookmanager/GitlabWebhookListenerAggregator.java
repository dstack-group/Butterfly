package it.unipd.dstack.butterfly.producer.gitlab.webhookmanager;

import it.unipd.dstack.butterfly.producer.producer.OnWebhookEvent;

/**
 * GitlabWebhookListenerAggregator performs the same single action for every different event
 * of this class that is fired.
 * @param <T>
 */
public class GitlabWebhookListenerAggregator<T> implements GitlabWebhookListener<T> {
    private final OnWebhookEvent<T> onWebhookEvent;

    public GitlabWebhookListenerAggregator(OnWebhookEvent<T> onWebhookEvent) {
        this.onWebhookEvent = onWebhookEvent;
    }

    @Override
    public void onIssueCreatedEvent(T event) {
        this.onWebhookEvent.handleEvent(event);
    }

    @Override
    public void onIssueEditedEvent(T event) {
        this.onWebhookEvent.handleEvent(event);
    }

    @Override
    public void onCommitCreatedEvent(T event) {
        this.onWebhookEvent.handleEvent(event);
    }
}
