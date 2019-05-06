/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    sonarqube-producer
 * @fileName:  SonarqubeWebhookListenerObserver.java
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
import it.unipd.dstack.butterfly.producer.avro.ServiceEventTypes;
import it.unipd.dstack.butterfly.producer.avro.Services;
import it.unipd.dstack.butterfly.producer.sonarqube.webhookmanager.webhookclient.WebhookListener;
import it.unipd.dstack.butterfly.producer.sonarqube.webhookmanager.webhookclient.model.AnalysisResult;
import org.apache.avro.AvroRuntimeException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class SonarqubeWebhookListenerObserver implements WebhookListener {
    private static final Logger logger = LoggerFactory.getLogger(SonarqubeWebhookListenerObserver.class);
    private final SonarqubeWebhookListener<Event> listener;

    public SonarqubeWebhookListenerObserver(SonarqubeWebhookListener<Event> listener) {
        this.listener = listener;
    }

    @Override
    public void onAnalysisCompletedEvent(AnalysisResult analysisEvent) {
        try {
            Event.Builder eventBuilder = Event.newBuilder();
            eventBuilder.setTimestamp(analysisEvent.getAnalysedAt().getTime());
            eventBuilder.setService(Services.SONARQUBE);
            eventBuilder.setProjectName(analysisEvent.getProject().getName());
            eventBuilder.setProjectURL(analysisEvent.getProject().getUrl());
            eventBuilder.setEventId(analysisEvent.getTaskId()); 
            eventBuilder.setEventType(ServiceEventTypes.SONARQUBE_PROJECT_ANALYSIS_COMPLETED);
            eventBuilder.setUsername(null);
            eventBuilder.setUserEmail(null);
            eventBuilder.setTitle(analysisEvent.getStatus());
            eventBuilder.setDescription(analysisEvent.getDescription());
            Event event = eventBuilder.build();
            this.listener.onAnalysisCompletedEvent(event);

            logger.info("Created AVRO Event after onAnalysisCompletedEvent");
        } catch (AvroRuntimeException e) {
            logger.error("AvroRuntimeException: " + e.getMessage() + " " + e.getStackTrace());
        }
    }

}
