/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    telegram-consumer
 * @fileName:  StartCommand.java
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

package it.unipd.dstack.butterfly.consumer.telegram.telegrambot.handler.commands;

import it.unipd.dstack.butterfly.consumer.telegram.message.TelegramMessage;
import it.unipd.dstack.butterfly.consumer.telegram.message.TelegramMessageSender;
import it.unipd.dstack.butterfly.consumer.telegram.response.TelegramResponse;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;

public class StartCommand implements Command {

    /**
     * Executes the specified command.
     *
     * @param sender
     * @param response
     * @throws RuntimeException thrown if something goes wrong.
     */
    @Override
    public void execute(TelegramMessageSender sender, TelegramResponse response) throws Exception {
        String messageContent = String.format("Welcome to Butterfly. Your chat ID is: %s", response.getChatId());
        TelegramMessage newMessage = new TelegramMessage(response.getChatId(), messageContent);
        try {
            sender.send(newMessage);
        } catch (TelegramApiException e) {
            throw e;
        }
    }

    /**
     * Returns the unique name of the current command.
     *
     * @return
     */
    @Override
    public String getCommandName() {
        return "start";
    }
}
