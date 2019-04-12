package it.unipd.dstack.butterfly.consumer.telegram.telegrambot.handler;

import it.unipd.dstack.butterfly.consumer.telegram.message.TelegramMessageSender;
import it.unipd.dstack.butterfly.consumer.telegram.response.TelegramResponse;
import it.unipd.dstack.butterfly.consumer.telegram.telegrambot.handler.commands.Command;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class CommandHandler {
    private static final Logger logger = LoggerFactory.getLogger(CommandHandler.class);

    public final void executeCommand(Command command,
                                     TelegramMessageSender messageSender,
                                     TelegramResponse response) {
        try {
            command.execute(messageSender, response);
        } catch (Exception e) {
            logger.error("CommandHandler Exception: {}", e);
        }
    }
}
