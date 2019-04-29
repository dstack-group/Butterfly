/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    redmine-producer
 * @fileName:  RedmineWebhookListener.java
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

package it.unipd.dstack.butterfly.producer.redmine.webhookmanager;

public interface RedmineWebhookListener <T> {
    /**
     * Emitted when a new issue has been created.
     * @param event
     */
    void onIssueCreatedEvent(T event);

    /**
     * Emitted when an existing issue has been edited.
     * @param event
     */
    void onIssueEditedEvent(T event);
}
