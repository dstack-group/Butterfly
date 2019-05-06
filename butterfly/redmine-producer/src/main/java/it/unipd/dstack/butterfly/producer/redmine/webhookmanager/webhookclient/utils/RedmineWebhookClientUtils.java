/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    producer
 * @fileName:  RedmineWebhookClientUtils.java
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

package it.unipd.dstack.butterfly.producer.redmine.webhookmanager.webhookclient.utils;

import java.util.Set;
import java.util.stream.Collectors;

public class RedmineWebhookClientUtils {
    private RedmineWebhookClientUtils() {}

    /**
     * Given a set of strings, it returns a new set of strings where each entry is guaranteed to be lower case.
     * If the given set of strings is null, NullPointerException is thrown.
     * @param input original set of strings
     * @return new set of lower case strings
     */
    public static Set<String> transformToLowerCase(Set<String> input) {
        return input.stream()
                .map(String::toLowerCase)
                .collect(Collectors.toSet());
    }
}
