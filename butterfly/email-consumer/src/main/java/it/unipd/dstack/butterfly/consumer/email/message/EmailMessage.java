/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    email-consumer
 * @fileName:  EmailMessage.java
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

package it.unipd.dstack.butterfly.consumer.email.message;

import it.unipd.dstack.butterfly.consumer.consumer.message.Message;

public class EmailMessage extends Message {
    private String subject;

    public EmailMessage(String recipient, String content, String subject) {
        super(recipient, content);
        this.subject = subject;
    }

    public String getSubject() {
        return subject;
    }
}
