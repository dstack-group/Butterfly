/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    sonarqube-producer
 * @fileName:  SonarqubeProducerController.java
 * @created:   2019-04-30
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

package it.unipd.dstack.butterfly.producer.sonarqube;

import it.unipd.dstack.butterfly.config.AbstractConfigManager;
import it.unipd.dstack.butterfly.producer.producer.OnWebhookEventFromTopic;
import it.unipd.dstack.butterfly.producer.producer.Producer;
import it.unipd.dstack.butterfly.producer.producer.controller.ProducerController;
import it.unipd.dstack.butterfly.producer.sonarqube.webhookmanager.SonarqubeWebhookListener;
import it.unipd.dstack.butterfly.producer.sonarqube.webhookmanager.SonarqubeWebhookListenerAggregator;
import it.unipd.dstack.butterfly.producer.sonarqube.webhookmanager.SonarqubeWebhookManager;
import it.unipd.dstack.butterfly.producer.webhookhandler.WebhookHandler;
import it.unipd.dstack.butterfly.producer.avro.Event;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.http.HttpServletRequest;

public class SonarqubeProducerController extends ProducerController<Event> {
    private static final Logger logger = LoggerFactory.getLogger(SonarqubeProducerController.class);

    private SonarqubeWebhookListener<Event> sonarqubeWebhookListener;
    private SonarqubeWebhookManager sonarqubeWebhookManager;

    public SonarqubeProducerController(
            AbstractConfigManager configManager,
            Producer<Event> producer,
            OnWebhookEventFromTopic<Event> onWebhookEventFromTopic
    ) {
        super(configManager, producer, onWebhookEventFromTopic, WebhookHandler.HTTPMethod.POST);

        this.sonarqubeWebhookListener = new SonarqubeWebhookListenerAggregator<>(this.onWebhookEvent);
        this.sonarqubeWebhookManager = new SonarqubeWebhookManager(this.sonarqubeWebhookListener);
    }

    /**
     * Releases ProducerController's implementation's resources
     */
    @Override
    protected void releaseResources() {
        // removes listeners from sonarqubeWebhookManager
        this.sonarqubeWebhookManager.close();
    }

    /**
     * Invoked when an exception is thrown
     *
     * @param e
     */
    @Override
    public void onProduceException(Exception e) {
        if (logger.isErrorEnabled()) {
            logger.error(String.format("Fatal exception: %s", e));
        }
        this.close();
    }

    /**
     * Invoked when a webhook request isn't properly parseable
     *
     * @param e
     */
    @Override
    public void onWebhookException(Exception e) {
        if (logger.isErrorEnabled()) {
            logger.error(String.format("Webhook exception: %s", e));
        }
    }

    /**
     * Called when the third-party service sends an HTTP request to the producer app
     *
     * @param request
     */
    @Override
    public void onWebhookRequest(HttpServletRequest request) {
        this.sonarqubeWebhookManager.onNewSonarqubeEvent(request);
    }
}
