/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    sonarqube-producer
 * @fileName:  SonarqubeWebhookManager.java
 * @created:   2019-04-30
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

package it.unipd.dstack.butterfly.producer.sonarqube.webhookmanager;

import it.unipd.dstack.butterfly.producer.avro.Event;
import it.unipd.dstack.butterfly.producer.sonarqube.webhookmanager.webhookclient.SonarqubeWebhookClient;
import it.unipd.dstack.butterfly.producer.sonarqube.webhookmanager.webhookclient.WebhookListener;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.http.HttpServletRequest;

public class SonarqubeWebhookManager {
    private static final Logger logger = LoggerFactory.getLogger(SonarqubeWebhookManager.class);

    private final SonarqubeWebhookClient webHookManager;
    private final WebhookListener webHookListener;

    public SonarqubeWebhookManager(SonarqubeWebhookListener<Event> listener) {
        webHookManager = new SonarqubeWebhookClient();
        this.webHookListener = new SonarqubeWebhookListenerObserver(listener);
        webHookManager.addListener(this.webHookListener);
    }

    public void onNewSonarqubeEvent(HttpServletRequest request) throws SonarqubeWebhookException {
        try {
            webHookManager.handleEvent(request);
            if (logger.isInfoEnabled()) {
                logger.info(String.format("NEW EVENT FROM %s", request.getRequestURI()));
            }
        } catch (Exception exception) {
            if (logger.isErrorEnabled()) {
                logger.error(String.format("Sonarqube API EXCEPTION %s", exception.getStackTrace()));
            }
            throw new SonarqubeWebhookException();
        }
    }

    /**
     * Removes attached listeners
     */
    public void close() {
        logger.info("CALLING CLOSE()");
        webHookManager.removeListener(this.webHookListener);
    }
}
