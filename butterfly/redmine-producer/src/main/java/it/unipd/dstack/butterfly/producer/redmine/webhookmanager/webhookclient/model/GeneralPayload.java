/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    redmine-producer
 * @fileName:  GeneralPayload.java
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

public class GeneralPayload {
    private String action;
    private Issue issue;

    public boolean isNewIssue() {
        return this.action.equals("opened");
    }

    public boolean isUpdatedIssue() {
        return this.action.equals("updated");
    }

    public String getAction() {
        return action;
    }

    public Issue getIssue() {
        return issue;
    }
}
