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
