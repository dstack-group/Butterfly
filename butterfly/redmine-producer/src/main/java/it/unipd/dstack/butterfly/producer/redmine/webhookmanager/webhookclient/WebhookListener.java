/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    redmine-producer
 * @fileName:  WebhookListener.java
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

package it.unipd.dstack.butterfly.producer.redmine.webhookmanager.webhookclient;

import it.unipd.dstack.butterfly.producer.redmine.webhookmanager.webhookclient.model.IssueCreatedPayload;
import it.unipd.dstack.butterfly.producer.redmine.webhookmanager.webhookclient.model.IssueEditedPayload;

public interface WebhookListener {
    void onIssueCreatedEvent(IssueCreatedPayload event);

    void onIssueEditedEvent(IssueEditedPayload event);
}
