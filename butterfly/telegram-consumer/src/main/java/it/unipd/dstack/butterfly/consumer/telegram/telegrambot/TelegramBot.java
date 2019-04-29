/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    telegram-consumer
 * @fileName:  TelegramBot.java
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

package it.unipd.dstack.butterfly.consumer.telegram.telegrambot;


import it.unipd.dstack.butterfly.consumer.telegram.message.TelegramMessage;

public interface TelegramBot {
    /**
     * Sends message to Telegram
     * @param message the message to send
     */
    void sendMessage(TelegramMessage message);

    /**
     * Releases Telegram Bot resources.
     */
    void close();
}
