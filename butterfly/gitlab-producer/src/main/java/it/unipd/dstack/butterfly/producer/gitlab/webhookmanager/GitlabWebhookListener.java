/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    gitlab-producer
 * @fileName:  GitlabWebhookListener.java
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

package it.unipd.dstack.butterfly.producer.gitlab.webhookmanager;

public interface GitlabWebhookListener <T> {
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

    /**
     * Emitted when a new commit has been created.
     * @param event
     */
    void onCommitCreatedEvent(T event);

    /**
     * Emitted when a new merge request has been created.
     * @param event
     */
    void onMergeRequestCreatedEvent(T event);

    /**
     * Emitted when an existing merge request has been edited.
     * @param event
     */
    void onMergeRequestEditedEvent(T event);

    /**
     * Emitted when an existing merge request has been closed.
     * @param event
     */
    void onMergeRequestClosedEvent(T event);

    /**
     * Emitted when an existing merge request has been merged.
     * @param event
     */
    void onMergeRequestMergedEvent(T event);
}
