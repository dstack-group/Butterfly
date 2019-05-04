/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    sonarqube-producer
 * @fileName:  SonarqubeWebhookListenerAggregator.java
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

import it.unipd.dstack.butterfly.producer.producer.OnWebhookEvent;

/**
 * SonarqubeWebhookListenerAggregator performs the same single action for every different event
 * of this class that is fired.
 * @param <T>
 */
public class SonarqubeWebhookListenerAggregator<T> implements SonarqubeWebhookListener<T> {
    private final OnWebhookEvent<T> onWebhookEvent;

    public SonarqubeWebhookListenerAggregator(OnWebhookEvent<T> onWebhookEvent) {
        this.onWebhookEvent = onWebhookEvent;
    }

    @Override
    public void onAnalysisCompletedEvent(T event) {
        this.onWebhookEvent.handleEvent(event);
    }


}
