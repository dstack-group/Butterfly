/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    redmine-producer
 * @fileName:  RedmineWebhookException.java
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

public class RedmineWebhookException extends RuntimeException {
    public RedmineWebhookException() {
        super("Redmine Webhok Exception");
    }
}
