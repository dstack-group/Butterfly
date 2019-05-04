/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    controller
 * @fileName:  Record.java
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 * Record is a container that taht stores the topic in which the message data should be sent,
 * as well as storing the data itself.
 */

package it.unipd.dstack.butterfly.controller.record;

public class Record <T> {
    private String topic;
    private T data;

    public Record(String topic, T data) {
        this.topic = topic;
        this.data = data;
    }

    public String getTopic() {
        return topic;
    }

    public T getData() {
        return data;
    }
}
