/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    redmine-producer
 * @fileName:  RedmineWebhookClientUtilsTest.java
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 * RedmineWebhookClientUtilsTest stores unit tests for the methods defined in RedmineWebhookClientUtils.
 */

package it.unipd.dstack.butterfly.producer.redmine.webhookmanager.webhookclient.utils;

import org.junit.jupiter.api.Test;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class RedmineWebhookClientUtilsTest {
    @Test
    public void transformToLowerCaseShouldReturnALowerCaseSet() {
        String LOW = "LOW";
        String MEDIUM = "Medium";
        String HIGH = "higH";
        Set<String> originalSet = new HashSet<>(Arrays.asList(LOW, MEDIUM, HIGH));
        Set<String> lowerCaseSet = RedmineWebhookClientUtils.transformToLowerCase(originalSet);
        assertEquals(originalSet.size(), lowerCaseSet.size());
        assertTrue(lowerCaseSet.contains(LOW.toLowerCase()));
        assertTrue(lowerCaseSet.contains(MEDIUM.toLowerCase()));
        assertTrue(lowerCaseSet.contains(HIGH.toLowerCase()));
    }

    @Test
    public void transformToLowerCaseShouldThrowIfSetIsNull() {
        assertThrows(NullPointerException.class, () -> RedmineWebhookClientUtils.transformToLowerCase(null));
    }
}
