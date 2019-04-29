/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    telegram-consumer
 * @fileName:  TelegramMessage.java
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

package it.unipd.dstack.butterfly.consumer.telegram.message;

import it.unipd.dstack.butterfly.consumer.consumer.message.Message;

public class TelegramMessage extends Message {
    public TelegramMessage(String contactRef, String content) {
        super(contactRef, content);
    }
}
