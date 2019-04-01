package it.unipd.dstack.butterfly.consumer.telegram.telegrambot.handler.commands;

import it.unipd.dstack.butterfly.consumer.telegram.telegrambot.OnBotResponse;
import org.slf4j.Logger;
import org.telegram.telegrambots.extensions.bots.commandbot.commands.BotCommand;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.api.objects.Chat;
import org.telegram.telegrambots.meta.api.objects.User;
import org.telegram.telegrambots.meta.bots.AbsSender;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;

import java.util.Arrays;

import static org.slf4j.LoggerFactory.getLogger;

public class EmailCommandOld extends BotCommand {
    private static final Logger logger = getLogger(EmailCommandOld.class);

    private final OnBotResponse onBotResponse;

    public EmailCommandOld(OnBotResponse onBotResponse) {
        super("email", "With this command you can specify your email ");
        this.onBotResponse = onBotResponse;
    }

    @Override
    public void execute(AbsSender absSender, User user, Chat chat, String[] params) {
        onBotResponse.onBotResponse(Long.toString(chat.getId()), Arrays.asList(params));

        StringBuilder messageBuilder = new StringBuilder();
        String userName = user.getFirstName() + " " + user.getLastName();

        /*
            put chat id into user manager here
         */

        messageBuilder
                .append("Ciao ")
                .append(userName)
                .append("/n ho inserito la mail: " + params[0]);

        SendMessage answer = new SendMessage();
        answer.setChatId(chat.getId().toString());
        answer.setText(messageBuilder.toString());

        try {
            absSender.execute(answer);
        } catch (TelegramApiException e) {
            logger.error("Error while sending the message... ");
        }
    }
}
