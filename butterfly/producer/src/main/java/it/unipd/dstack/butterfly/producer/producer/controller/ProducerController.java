package it.unipd.dstack.butterfly.producer.producer.controller;

import it.unipd.dstack.butterfly.config.AbstractConfigManager;
import it.unipd.dstack.butterfly.controller.Controller;
import it.unipd.dstack.butterfly.producer.producer.OnWebhookEvent;
import it.unipd.dstack.butterfly.producer.producer.OnWebhookEventFromTopic;
import it.unipd.dstack.butterfly.producer.producer.Producer;
import it.unipd.dstack.butterfly.producer.webhookhandler.WebhookHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.http.HttpServletRequest;
import java.util.concurrent.CompletableFuture;

public abstract class ProducerController<V> implements Controller {
    private static final Logger logger = LoggerFactory.getLogger(ProducerController.class);

    protected final AbstractConfigManager configManager;
    protected final String serviceName;
    private final String kafkaTopic;
    private final int serverPort;
    private final String webhookEndpoint;
    private final OnWebhookEventFromTopic<V> onWebhookEventFromTopic;
    protected final OnWebhookEvent<V> onWebhookEvent;
    private final WebhookHandler webhookHandler;

    private Producer<V> producer;

    public ProducerController(
            AbstractConfigManager configManager,
            Producer<V> producer,
            OnWebhookEventFromTopic<V> onWebhookEventFromTopic,
            WebhookHandler.HTTPMethod httpMethod
    ) {
        this.configManager = configManager;
        this.serviceName = configManager.getStringProperty("SERVICE_NAME");
        this.kafkaTopic = configManager.getStringProperty("KAFKA_TOPIC");
        this.serverPort = configManager.getIntProperty("SERVER_PORT");
        this.webhookEndpoint = configManager.getStringProperty("WEBHOOK_ENDPOINT");
        this.onWebhookEventFromTopic = onWebhookEventFromTopic;

        /*
        this.onWebhookEvent = (V event) -> {
            logger.info(serviceName + " Received event: " + event.toString());
            return onWebhookEventFromTopic.onEvent(producer, this.kafkaTopic)
                    .handleEvent(event);
        };
        */

        // this.onWebhookEvent = onWebhookEventFromTopic.onEvent(producer, this.kafkaTopic);
        this.onWebhookEvent = new ProducerOnWebhookEvent();

        this.webhookHandler = new WebhookHandler.Builder()
                .setRoute(this.webhookEndpoint)
                .setMethod(httpMethod)
                .setWebhookConsumer(this::onWebhookRequest)
                .setExceptionConsumer(this::onWebhookException)
                .create();

        this.producer = producer;

        /**
         * Graceful shutdown
         */
        this.gracefulShutdown();
    }

    /**
     * Spins up the controller.
     */
    final public void start() {
        logger.info(this.serviceName + " started");
        this.webhookHandler.listen(this.serverPort);
        logger.info(this.serviceName + " listening on port: " + serverPort);
        this.producer.awaitUntilError(this::onProduceException);
    }

    /**
     * Closes the controller and releases resources.
     */
    final public void close() {
        logger.info("Closing " + this.serviceName);
        // terminates the production process
        this.producer.close();
        this.releaseResources();
        logger.info("Released resources " + this.serviceName);
    }

    /**
     * Invoked when an exception is thrown.
     * @param e
     */
    abstract public void onProduceException(Exception e);

    /**
     * Invoked when a webhook request isn't properly parseable.
     * @param e
     */
    abstract public void onWebhookException(Exception e);

    /**
     * Called when the third-party service sends an HTTP request to the producer app.
     * @param request
     */
    abstract public void onWebhookRequest(HttpServletRequest request);

    /**
     * Releases ProducerController's implementation's resources
     */
    protected void releaseResources() {
        // NO-OP if it isn't overridden
    }

    private class ProducerOnWebhookEvent implements OnWebhookEvent<V> {
        private OnWebhookEvent<V> onWebhookEvent =
                onWebhookEventFromTopic.onEvent(producer, ProducerController.this.kafkaTopic);

        /**
         * This method is called when a WebHook event has been received. The event object has info about the
         * specific event type and its data.
         *
         * @param event
         */
        @Override
        public CompletableFuture<Void> handleEvent(V event) {
            logger.info(serviceName + " Received event: " + event.toString());
            return this.onWebhookEvent
                    .handleEvent(event);
        }
    }
}
