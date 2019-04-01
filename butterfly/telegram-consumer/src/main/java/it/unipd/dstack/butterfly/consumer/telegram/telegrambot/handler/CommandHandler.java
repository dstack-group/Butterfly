package it.unipd.dstack.butterfly.consumer.telegram.telegrambot.handler;

import it.unipd.dstack.butterfly.consumer.telegram.message.TelegramMessageSender;
import it.unipd.dstack.butterfly.consumer.telegram.response.TelegramResponse;
import it.unipd.dstack.butterfly.consumer.telegram.telegrambot.handler.commands.Command;

import java.util.HashMap;
import java.util.Map;

public class CommandHandler {
    private Map<String, Command> commandMap = new HashMap<>();

    public CommandHandler() {
    }

    public final CommandHandler register(Command botCommand) {
        if (!commandMap.containsKey(botCommand.getCommandName())) {
            commandMap.put(botCommand.getCommandName(), botCommand);
        }
        return this;
    }

    public final boolean executeCommand(String commandName, TelegramMessageSender messageSender, TelegramResponse response) {
        if (commandMap.containsKey(commandName)) {
            try {
                commandMap.get(commandName).execute(messageSender, response);
            } catch (Exception e) {
                // TODO: handle
                e.printStackTrace();
            }
            return true;
        }
        return false;
    }

    public final void unregisterAll() {
        this.commandMap = null;
    }
}
