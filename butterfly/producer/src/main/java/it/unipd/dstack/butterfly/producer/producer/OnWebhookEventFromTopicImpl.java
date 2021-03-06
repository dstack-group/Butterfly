/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    producer
 * @fileName:  OnWebhookEventFromTopicImpl.java
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

package it.unipd.dstack.butterfly.producer.producer;

import it.unipd.dstack.butterfly.controller.record.Record;

public class OnWebhookEventFromTopicImpl<T> implements OnWebhookEventFromTopic<T> {
    /**
     * This method is called when a WebHook event has been received. This method applies currying.
     *
     * @param producer the producer implementation that needs to send the enclosed event in the given topic.
     * @param topic    the name of the topic where the record of the given event will be sent.
     */
    @Override
    public OnWebhookEvent<T> onEvent(Producer<T> producer, String topic) {
        return event -> {
            Record<T> record = new Record<>(topic, event);
            return producer.send(record);
        };
    }
}
