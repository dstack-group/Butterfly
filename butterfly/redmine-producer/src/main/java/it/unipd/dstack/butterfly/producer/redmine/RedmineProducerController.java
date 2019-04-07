package it.unipd.dstack.butterfly.producer.redmine;

import it.unipd.dstack.butterfly.config.AbstractConfigManager;
import it.unipd.dstack.butterfly.producer.producer.OnWebhookEventFromTopic;
import it.unipd.dstack.butterfly.producer.producer.Producer;
import it.unipd.dstack.butterfly.producer.producer.controller.ProducerController;
import it.unipd.dstack.butterfly.producer.redmine.webhookmanager.RedmineWebhookListener;
import it.unipd.dstack.butterfly.producer.redmine.webhookmanager.RedmineWebhookListenerAggregator;
import it.unipd.dstack.butterfly.producer.redmine.webhookmanager.RedmineWebhookManager;
import it.unipd.dstack.butterfly.producer.webhookhandler.WebhookHandler;
import it.unipd.dstack.butterfly.producer.avro.Event;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.http.HttpServletRequest;

public class RedmineProducerController extends ProducerController<Event> {
    private static final Logger logger = LoggerFactory.getLogger(RedmineProducerController.class);

    private RedmineWebhookListener<Event> redmineWebhookListener;
    private RedmineWebhookManager redmineWebhookManager;

    public RedmineProducerController(
            AbstractConfigManager configManager,
            Producer<Event> producer,
            OnWebhookEventFromTopic<Event> onWebhookEventFromTopic
    ) {
        super(configManager, producer, onWebhookEventFromTopic, WebhookHandler.HTTPMethod.POST);

        this.redmineWebhookListener = new RedmineWebhookListenerAggregator<>(this.onWebhookEvent);
        this.redmineWebhookManager = new RedmineWebhookManager(this.redmineWebhookListener);
    }

    /**
     * Releases ProducerController's implementation's resources
     */
    @Override
    protected void releaseResources() {
        // removes listeners from gitlabWebhookManager
        this.redmineWebhookManager.close();
    }

    /**
     * Invoked when an exception is thrown
     *
     * @param e
     */
    @Override
    public void onProduceException(Exception e) {
        logger.error("Exception: " + e);
        this.close();
    }

    /**
     * Invoked when a webhook request isn't properly parseable
     *
     * @param e
     */
    @Override
    public void onWebhookException(Exception e) {
        logger.error(serviceName + " Exception " + e);
    }

    /**
     * Called when the third-party service sends an HTTP request to the producer app
     *
     * @param request
     */
    @Override
    public void onWebhookRequest(HttpServletRequest request) {
        this.redmineWebhookManager.onNewRedmineEvent(request);
    }
}
