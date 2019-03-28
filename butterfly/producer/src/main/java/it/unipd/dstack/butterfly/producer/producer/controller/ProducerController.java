package it.unipd.dstack.butterfly.producer.producer.controller;

import it.unipd.dstack.butterfly.config.ConfigManager;
import it.unipd.dstack.butterfly.config.controller.Controller;
import it.unipd.dstack.butterfly.config.record.Record;
import it.unipd.dstack.butterfly.producer.producer.OnWebhookEvent;
import it.unipd.dstack.butterfly.producer.producer.Producer;
import it.unipd.dstack.butterfly.producer.webhookhandler.WebhookHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.http.HttpServletRequest;

public abstract class ProducerController<V> implements Controller {
    private static final Logger logger = LoggerFactory.getLogger(ProducerController.class);

    protected final String serviceName;
    private final String kafkaTopic;
    private final int serverPort;
    private final String webhookEndpoint;

    /**
     * This must be estracted somehow
     */
    protected final OnWebhookEvent<V> onWebhookEvent;
    private final WebhookHandler webhookHandler;

    private Producer<V> producer;

    public ProducerController(Producer<V> producer, WebhookHandler.HTTPMethod httpMethod) {
        this.serviceName = ConfigManager.getStringProperty("SERVICE_NAME");
        this.kafkaTopic = ConfigManager.getStringProperty("KAFKA_TOPIC");
        this.serverPort = ConfigManager.getIntProperty("SERVER_PORT");
        this.webhookEndpoint = ConfigManager.getStringProperty("WEBHOOK_ENDPOINT");

        this.onWebhookEvent = (V event) -> {
            logger.info(serviceName + " Received event: " + event.toString());
            Record<V> record = new Record<>(kafkaTopic, event);
            return this.producer.send(record);
        };

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
}
