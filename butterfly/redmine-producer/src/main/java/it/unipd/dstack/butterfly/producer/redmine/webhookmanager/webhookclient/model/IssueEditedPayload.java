/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    redmine-producer
 * @fileName:  IssueEditedPayload.java
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

package it.unipd.dstack.butterfly.producer.redmine.webhookmanager.webhookclient.model;

public class IssueEditedPayload {
    Issue issue;
    Journal journal;
    String url;

    public Issue getIssue() {
        return issue;
    }

    public Journal getJournal() {
        return journal;
    }

    public String getUrl() {
        return url;
    }
}
