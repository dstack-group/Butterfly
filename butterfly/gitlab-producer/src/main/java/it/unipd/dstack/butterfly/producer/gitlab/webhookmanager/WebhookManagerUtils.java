/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    gitlab-producer
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

package it.unipd.dstack.butterfly.producer.gitlab.webhookmanager;

class WebhookManagerUtils {
    private WebhookManagerUtils() {}

    static <T extends Number> String numberToString(T number) {
        return String.valueOf(number);
    }
}
