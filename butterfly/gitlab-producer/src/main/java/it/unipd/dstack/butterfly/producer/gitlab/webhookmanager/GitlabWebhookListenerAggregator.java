package it.unipd.dstack.butterfly.producer.gitlab.webhookmanager;

import it.unipd.dstack.butterfly.producer.gitlab.GitlabProducerController;
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

    @Override
    public void onIssueCreatedEvent(T event) {
        logger.info("onIssueCreatedEvent called " + event);
        this.onWebhookEvent.handleEvent(event);
    }

    @Override
    public void onIssueEditedEvent(T event) {
        logger.info("onIssueEditedEvent called " + event);
        this.onWebhookEvent.handleEvent(event);
    }

    @Override
    public void onCommitCreatedEvent(T event) {
        logger.info("onCommitCreatedEvent called " + event);
        this.onWebhookEvent.handleEvent(event);
    }
}
