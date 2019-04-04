package it.unipd.dstack.butterfly.consumer.telegram.telegrambot.handler.commands;

import it.unipd.dstack.butterfly.common.eventprocessor.EventProcessor;
import it.unipd.dstack.butterfly.consumer.avro.EmailWithContactRef;
import it.unipd.dstack.butterfly.consumer.telegram.message.TelegramMessage;
import it.unipd.dstack.butterfly.consumer.telegram.message.TelegramMessageSender;
import it.unipd.dstack.butterfly.consumer.telegram.response.TelegramResponse;
import it.unipd.dstack.butterfly.consumer.utils.EmailValidator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;

public class EmailCommand implements Command {
    EventProcessor eventProcessor;
    private static final Logger logger = LoggerFactory.getLogger(EmailCommand.class);

    public EmailCommand(EventProcessor eventProcessor) {
        this.eventProcessor = eventProcessor;
    }

    /**
     * Executes the specified command.
     *
     * @throws RuntimeException thrown if something goes wrong.
     */
    @Override
    public void execute(TelegramMessageSender sender, TelegramResponse response) throws Exception {
        String emailAddress = response.getCommandArguments().get(0);
        String messageContent = "";

        EmailWithContactRef emailWithContactRef = EmailWithContactRef.newBuilder().build();
        emailWithContactRef.setContactRef(response.getChatId());
        emailWithContactRef.setEmail(emailAddress);

        eventProcessor.processEvent(emailWithContactRef, EmailCommand.class)
                .thenAcceptAsync(reply -> {
                    if (reply == null) {
                        logger.error("Reply lost from eventProcessor");
                    } else {
                        logger.info("Reply received from eventProcessor: " + reply);
                        this.onValidResponse(sender, response);
                    }
                })
                .exceptionally(e -> {
                    logger.error("Exception in processEvent: " + e);
                    //todo this.onNotValidResponse()
                    return null;
                });

        if (!EmailValidator.isValidEmailAddress(emailAddress)) {
            messageContent = emailAddress + " non è un'email valida";
            TelegramMessage newMessage = new TelegramMessage(response.getChatId(), messageContent);
            try {
                sender.send(newMessage);
            } catch (TelegramApiException e) {
                throw e;
            }
        }


    }

    private void onValidResponse(TelegramMessageSender sender, TelegramResponse response) {
        String messageContent = "Connessione con il Gestore Utente avvenuta correttamente.";
        TelegramMessage newMessage = new TelegramMessage(response.getChatId(), messageContent);
        try {
            sender.send(newMessage);
        } catch (Exception e) {
            logger.error("errore while sending message: " + messageContent);
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

    /**
     * This method is called when execute() is called
     */
    @Override
    public void onExecution() {

    }
}
