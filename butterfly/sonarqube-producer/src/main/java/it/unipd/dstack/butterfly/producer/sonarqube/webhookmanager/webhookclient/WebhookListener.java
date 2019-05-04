/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    sonarqube-producer
 * @fileName:  WebhookListener.java
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

import it.unipd.dstack.butterfly.producer.sonarqube.webhookmanager.webhookclient.model.AnalysisResult;

public interface WebhookListener {
    void onAnalysisCompletedEvent(AnalysisResult event);

}
