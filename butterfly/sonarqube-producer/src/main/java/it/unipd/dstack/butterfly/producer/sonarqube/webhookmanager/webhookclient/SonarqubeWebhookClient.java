/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    sonarqube-producer
 * @fileName:  SonarqubeWebhookClient.java
 * @created:   2019-04-30
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

package it.unipd.dstack.butterfly.producer.sonarqube.webhookmanager.webhookclient;

import it.unipd.dstack.butterfly.jsonconverter.JSONConverter;
import it.unipd.dstack.butterfly.jsonconverter.JSONConverterImpl;
import it.unipd.dstack.butterfly.producer.sonarqube.webhookmanager.SonarqubeWebhookException;
import it.unipd.dstack.butterfly.producer.sonarqube.webhookmanager.webhookclient.model.AnalysisResult;
import it.unipd.dstack.butterfly.producer.sonarqube.webhookmanager.webhookclient.utils.HttpRequestUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

public class SonarqubeWebhookClient {
    private static final Logger logger = LoggerFactory.getLogger(SonarqubeWebhookClient.class);
    private final List<WebhookListener> webhookListeners = new CopyOnWriteArrayList<>();

    public static final JSONConverter jsonConverter = new JSONConverterImpl(false);


    public SonarqubeWebhookClient() {
    }

    /**
     * Adds a webhook event listener.
     *
     * @param listener the SystemHookListener to add
     */
    public void addListener(WebhookListener listener) {
        if (!webhookListeners.contains(listener)) {
            webhookListeners.add(listener);
        }
    }

    /**
     * Removes a webhook event listener.
     *
     * @param listener the SystemHookListener to remove
     */
    public void removeListener(WebhookListener listener) {
        webhookListeners.remove(listener);
    }

    /**
     * Parses and verifies an Event instance from the HTTP POST request and
     * fires it off to the registered listeners.
     *
     * @param request the HttpServletRequest to read the Event instance from
     * @throws SonarqubeWebhookException if the parsed event is not supported
     */
    public void handleEvent(HttpServletRequest request) throws SonarqubeWebhookException {
        try {
            String postData = HttpRequestUtils.getPostDataAsString(request);
            AnalysisResult analysisResult = jsonConverter.fromJson(postData, AnalysisResult.class);
            this.fireAnalysisCompletedEvent(analysisResult);

        } catch (IOException | NullPointerException e) {
            logger.error("Exception e in handleEvent: " + e);
            throw new SonarqubeWebhookException();
        }
    }

    private void fireAnalysisCompletedEvent(AnalysisResult event) {
        webhookListeners.forEach(listener -> listener.onAnalysisCompletedEvent(event));
    }
}
