/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    producer
 * @fileName:  ProducerController.java
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

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

public abstract class ProducerController<V> implements Controller {
    private static final Logger logger = LoggerFactory.getLogger(ProducerController.class);

    protected final AbstractConfigManager configManager;
    protected final String serviceName;
    private final String kafkaTopic;
    private final int serverPort;
    private final String webhookEndpoint;
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
        this.onWebhookEvent = onWebhookEventFromTopic.onEvent(producer, this.kafkaTopic);

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
    public final void start() {
        this.webhookHandler.listen(this.serverPort);
        if (logger.isInfoEnabled()) {
            logger.info(String.format("%s started", this.serviceName));
            logger.info(String.format("%s listening on port: %s", this.serviceName, this.serverPort));
        }
        //this.producer.awaitUntilError(this::onProduceException);
    }

    /**
     * Closes the controller and releases resources.
     */
    public final void close() {
        if (logger.isInfoEnabled()) {
            logger.info(String.format("Closing %s", this.serviceName));
        }

        // terminates the production process
        this.producer.close();
        this.releaseResources();

        if (logger.isInfoEnabled()) {
            logger.info(String.format("Released resources %s", this.serviceName));
        }
    }

    /**
     * Invoked when an exception is thrown.
     * @param e
     */
    public abstract void onProduceException(Exception e);

    /**
     * Invoked when a webhook request isn't properly parseable.
     * @param e
     */
    public abstract void onWebhookException(Exception e);

    /**
     * Called when the third-party service sends an HTTP request to the producer app.
     * @param request
     */
    public abstract void onWebhookRequest(HttpServletRequest request);

    /**
     * Releases ProducerController's implementation's resources
     */
    protected void releaseResources() {
        // NO-OP if it isn't overridden
    }
}
