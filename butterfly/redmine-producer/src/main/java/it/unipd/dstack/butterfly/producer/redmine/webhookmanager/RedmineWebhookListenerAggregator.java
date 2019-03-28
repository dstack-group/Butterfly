package it.unipd.dstack.butterfly.producer.redmine.webhookmanager;

import it.unipd.dstack.butterfly.producer.producer.OnWebhookEvent;

/**
 * RedmineWebhookListenerAggregator performs the same single action for every different event
 * of this class that is fired.
 * @param <T>
 */
public class RedmineWebhookListenerAggregator<T> implements RedmineWebhookListener<T> {
    private final OnWebhookEvent<T> onWebhookEvent;

    public RedmineWebhookListenerAggregator(OnWebhookEvent<T> onWebhookEvent) {
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
}
