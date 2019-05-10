/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    producer
 * @fileName:  BrokerTest.java
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

package it.unipd.dstack.butterfly.producer.testutils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class BrokerTest<T> {
    /**
     * Key: the topic.
     * Value: the list of values for the given topic.
     */
    private Map<String, List<T>> broker = new HashMap<>();

    private static <V> List<V> createList(String key) {
        return new ArrayList<>();
    }

    public void publishToTopic(String topic, T data) {
        this.broker.computeIfAbsent(topic, BrokerTest::createList).add(data);
    }

    public List<T> getDataByTopic(String topic) {
        return this.broker.get(topic);
    }

    public void clear() {
        this.broker.clear();
    }
}
