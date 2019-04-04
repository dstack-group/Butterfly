package it.unipd.dstack.butterfly.consumer.telegram.telegrambot.handler;

import it.unipd.dstack.butterfly.consumer.telegram.message.TelegramMessageSender;
import it.unipd.dstack.butterfly.consumer.telegram.response.TelegramResponse;
import it.unipd.dstack.butterfly.consumer.telegram.telegrambot.handler.commands.Command;

public class CommandHandler {
    public CommandHandler() {}

    public final void executeCommand(Command command,
                                     TelegramMessageSender messageSender,
                                     TelegramResponse response) {
        try {
            command.execute(messageSender, response);
        } catch (Exception e) {
            // TODO: handle
            e.printStackTrace();
        }
    }
}
