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
 */

package it.unipd.dstack.butterfly.controller.record;

/**
 * Object that stores the topic in which the data should be sent, and the data itself
 * @param <T>
 */
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
