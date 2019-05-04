/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    telegram-consumer
 * @fileName:  Command.java
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

import it.unipd.dstack.butterfly.consumer.telegram.message.TelegramMessageSender;
import it.unipd.dstack.butterfly.consumer.telegram.response.TelegramResponse;

public interface Command {
    /**
     * Executes the specified command.
     * @throws RuntimeException thrown if something goes wrong.
     */
    void execute(TelegramMessageSender sender, TelegramResponse response) throws Exception;

    /**
     * Returns the unique name of the current command.
     * @return
     */
    String getCommandName();
}
