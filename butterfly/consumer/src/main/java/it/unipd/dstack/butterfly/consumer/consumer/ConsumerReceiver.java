/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    consumer
 * @fileName:  ConsumerReceiver.java
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 * ConsumerReceiver is a FunctionalInterface that defines how a Consumer should subscribe to messages that come
 * from a list of topics.
 */

package it.unipd.dstack.butterfly.consumer.consumer;

import java.util.List;

@FunctionalInterface
public interface ConsumerReceiver {
    /**
     * Subscribes to the given list of topics to get dynamically assigned partitions.
     * @param topicList
     */
    void subscribe(List<String> topicList);
}
