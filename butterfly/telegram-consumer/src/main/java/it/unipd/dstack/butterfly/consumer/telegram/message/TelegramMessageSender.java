/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    telegram-consumer
 * @fileName:  TelegramMessageSender.java
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

@FunctionalInterface
public interface TelegramMessageSender {
    /**
     * Sends the specified TelegramMessage.
     * @param message
     */
    void send(TelegramMessage message) throws Exception;
}
