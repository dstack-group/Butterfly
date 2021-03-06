/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    telegram-consumer
 * @fileName:  EmailCommand.java
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
        if (!response.getCommandArguments().isEmpty()) {
            String emailAddress = response.getCommandArguments().get(0);
            logger.info("emailAddress " + emailAddress);

            if (!EmailValidator.isValidEmailAddress(emailAddress)) {
                String messageContent = emailAddress + " is not a valid email.";
                TelegramMessage newMessage = new TelegramMessage(response.getChatId(), messageContent);
                try {
                    sender.send(newMessage);
                } catch (TelegramApiException e) {
                    throw e;
                }
            } else {
                var emailWithContactRefBuilder = EmailWithContactRef.newBuilder();
                emailWithContactRefBuilder.setContactRef(response.getChatId());
                emailWithContactRefBuilder.setUserEmail(emailAddress);
                EmailWithContactRef emailWithContactRef = emailWithContactRefBuilder.build();

                // it should process the event if and only if the email address is valid
                eventProcessor.processEvent(emailWithContactRef, EmailCommand.class)
                        .thenAcceptAsync(reply -> {
                            String messageContent;
                            if (reply == null) {
                                logger.error("Reply lost from eventProcessor");
                                messageContent = "Connection error.";
                            } else {
                                logger.info("Reply received from eventProcessor: " + reply);
                                messageContent = "The connection with the User Manager was successfully established.";
                            }

                            TelegramMessage newMessage = new TelegramMessage(response.getChatId(), messageContent);
                            this.sendAnswer(sender, newMessage);
                        })
                        .exceptionally(e -> {
                            logger.error("Exception in processEvent: " + e);
                            return null;
                        });
            }
        } else {
            TelegramMessage errorMessage = new TelegramMessage(response.getChatId(),
                    "You must specify an email address.");
            this.sendAnswer(sender, errorMessage);
        }
    }

    private void sendAnswer(TelegramMessageSender sender, TelegramMessage message) {
        try {
            sender.send(message);
        } catch (Exception e) {
            logger.error("error while sending message: " + message.getContent());
        }
    }

    /**
     * Returns the unique name of the current command.
     *
     * @return
     */
    @Override
    public String getCommandName() {
        return "email";
    }
}