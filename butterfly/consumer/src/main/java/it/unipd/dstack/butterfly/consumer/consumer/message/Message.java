/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    consumer
 * @fileName:  Message.java
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 * Message is a simple container class for a message to be sent to someone.
 * Once created, it is read-only.
 */

package it.unipd.dstack.butterfly.consumer.consumer.message;

public abstract class Message {
    private String recipient;
    private String content;

    public Message(String recipient, String content) {
        this.recipient = recipient;
        this.content = content;
    }

    public String getRecipient() {
        return recipient;
    }

    public String getContent() {
        return content;
    }
}
