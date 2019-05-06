/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    redmine-producer
 * @fileName:  IssueCreatedPayload.java
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

public class IssueCreatedPayload {
    Issue issue;
    String url;

    public Issue getIssue() {
        return issue;
    }

    public String getUrl() {
        return url;
    }
}
