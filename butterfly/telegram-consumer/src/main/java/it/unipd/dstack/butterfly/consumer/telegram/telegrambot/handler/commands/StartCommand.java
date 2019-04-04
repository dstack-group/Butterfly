package it.unipd.dstack.butterfly.consumer.telegram.telegrambot.handler.commands;

import it.unipd.dstack.butterfly.consumer.telegram.message.TelegramMessageSender;
import it.unipd.dstack.butterfly.consumer.telegram.response.TelegramResponse;

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
        //stampa messaggio introduttivo:
        //breve introduzione
        //lista di comandi disponibili
    }

    /**
     * Returns the unique name of the current command.
     *
     * @return
     */
    @Override
    public String getCommandName() {
        return "START";
    }
}
