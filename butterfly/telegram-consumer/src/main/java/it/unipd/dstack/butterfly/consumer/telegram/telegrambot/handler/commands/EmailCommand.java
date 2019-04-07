package it.unipd.dstack.butterfly.consumer.telegram.telegrambot.handler.commands;

import it.unipd.dstack.butterfly.eventprocessor.EventProcessor;
import it.unipd.dstack.butterfly.consumer.avro.EmailWithContactRef;
import it.unipd.dstack.butterfly.consumer.telegram.message.TelegramMessage;
import it.unipd.dstack.butterfly.consumer.telegram.message.TelegramMessageSender;
import it.unipd.dstack.butterfly.consumer.telegram.response.TelegramResponse;
import it.unipd.dstack.butterfly.consumer.utils.EmailValidator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;

public class EmailCommand implements Command {
    private final EventProcessor eventProcessor;
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

        if (!EmailValidator.isValidEmailAddress(emailAddress)) {
            String messageContent = emailAddress + " non è un'email valida";
            TelegramMessage newMessage = new TelegramMessage(response.getChatId(), messageContent);
            try {
                sender.send(newMessage);
            } catch (TelegramApiException e) {
                throw e;
            }
        } else {
            EmailWithContactRef emailWithContactRef = EmailWithContactRef.newBuilder().build();
            emailWithContactRef.setContactRef(response.getChatId());
            emailWithContactRef.setEmail(emailAddress);

            // it should process the event if and only if the email address is valid
            eventProcessor.processEvent(emailWithContactRef, EmailCommand.class)
                    .thenAcceptAsync(reply -> {
                        String messageContent;
                        if (reply == null) {
                            logger.error("Reply lost from eventProcessor");
                            messageContent = "Connection error";
                        } else {
                            logger.info("Reply received from eventProcessor: " + reply);
                            messageContent = "Connection successful";
                        }

                        TelegramMessage newMessage = new TelegramMessage(response.getChatId(), messageContent);
                        this.sendAnswer(sender, newMessage);
                    })
                    .exceptionally(e -> {
                        logger.error("Exception in processEvent: " + e);
                        //todo this.onNotValidResponse()
                        return null;
                    });
        }
    }

    private void sendAnswer(TelegramMessageSender sender, TelegramMessage message) {
        try {
            sender.send(message);
        } catch (Exception e) {
            logger.error("errore while sending message: " + message.getContent());
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