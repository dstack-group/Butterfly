package it.unipd.dstack.butterfly.consumer.telegram.telegrambot.handler.commands;

import it.unipd.dstack.butterfly.consumer.telegram.message.TelegramMessage;
import it.unipd.dstack.butterfly.consumer.telegram.message.TelegramMessageSender;
import it.unipd.dstack.butterfly.consumer.telegram.response.TelegramResponse;
import it.unipd.dstack.butterfly.consumer.utils.EmailValidator;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;

public class EmailCommand implements Command {
    public EmailCommand() {

    }

    /**
     * Executes the specified command.
     *
     * @throws RuntimeException thrown if something goes wrong.
     */
    @Override
    public void execute(TelegramMessageSender sender, TelegramResponse response) throws Exception {
        String emailAddress = response.getCommandArguments().get(0);

        String messageContent;
        if (EmailValidator.isValidEmailAddress(emailAddress)) {
            messageContent = "Ciao, ho inserito la mail " + emailAddress;
        } else {
            messageContent = emailAddress + " non è un'email valida";
        }

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
        return "EMAIL";
    }
}
