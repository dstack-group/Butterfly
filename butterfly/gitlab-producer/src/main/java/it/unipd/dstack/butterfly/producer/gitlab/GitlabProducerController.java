package it.unipd.dstack.butterfly.producer.gitlab;

import it.unipd.dstack.butterfly.config.AbstractConfigManager;
import it.unipd.dstack.butterfly.producer.gitlab.webhookmanager.GitlabWebhookListener;
import it.unipd.dstack.butterfly.producer.gitlab.webhookmanager.GitlabWebhookListenerAggregator;
import it.unipd.dstack.butterfly.producer.producer.OnWebhookEventFromTopic;
import it.unipd.dstack.butterfly.producer.producer.Producer;
import it.unipd.dstack.butterfly.producer.producer.controller.ProducerController;
import it.unipd.dstack.butterfly.producer.webhookhandler.WebhookHandler;
import it.unipd.dstack.butterfly.producer.avro.Event;
import it.unipd.dstack.butterfly.producer.gitlab.webhookmanager.GitlabWebhookManager;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.http.HttpServletRequest;

public class GitlabProducerController extends ProducerController<Event> {
    private static final Logger logger = LoggerFactory.getLogger(GitlabProducerController.class);

    private final String secretToken;
    private GitlabWebhookListener<Event> gitlabWebhookListener;
    private GitlabWebhookManager gitlabWebhookManager;

    public GitlabProducerController(
            AbstractConfigManager configManager,
            Producer<Event> producer,
            OnWebhookEventFromTopic<Event> onWebhookEventFromTopic
    ) {
        super(configManager, producer, onWebhookEventFromTopic, WebhookHandler.HTTPMethod.POST);
        this.secretToken = configManager.getStringProperty("SECRET_TOKEN");

        this.gitlabWebhookListener = new GitlabWebhookListenerAggregator<>(this.onWebhookEvent);
        this.gitlabWebhookManager = new GitlabWebhookManager(this.secretToken, this.gitlabWebhookListener);
    }

    /**
     * Releases ProducerController's implementation's resources
     */
    @Override
    protected void releaseResources() {
        // removes listeners from gitlabWebhookManager
        this.gitlabWebhookManager.close();
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
        this.gitlabWebhookManager.onNewGitlabEvent(request);
    }
}
