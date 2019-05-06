/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    redmine-producer
 * @fileName:  WebhookManagerUtils.java
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 * WebhookManagerUtils contains common utilities for GitLab's WebhookManager.
 */

package it.unipd.dstack.butterfly.producer.redmine.webhookmanager;

public class WebhookManagerUtils {
    private WebhookManagerUtils() {}

    static String longToString(Long number) {
        return Long.toString(number);
    }
}
