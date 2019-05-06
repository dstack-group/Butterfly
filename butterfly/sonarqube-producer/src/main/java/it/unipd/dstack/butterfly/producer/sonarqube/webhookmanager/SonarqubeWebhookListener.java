/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    sonarqube-producer
 * @fileName:  SonarqubeWebhookListener.java
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


public interface SonarqubeWebhookListener <T> {
    /**
     * Emitted when a new Analysis has been Completed.
     * @param event
     */
    void onAnalysisCompletedEvent(T event);

}
