package it.unipd.dstack.butterfly.consumer.telegram.telegrambot.handler.commands;

import org.slf4j.Logger;
import org.telegram.telegrambots.extensions.bots.commandbot.commands.BotCommand;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.api.objects.Chat;
import org.telegram.telegrambots.meta.api.objects.User;
import org.telegram.telegrambots.meta.bots.AbsSender;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;
import static org.slf4j.LoggerFactory.getLogger;

public class StartCommandOld extends BotCommand {

    private static final Logger logger = getLogger(StartCommandOld.class);

    public StartCommandOld(){
        super("start", "With this command you can start the Bot");

    }

    @Override
    public void execute(AbsSender absSender, User user, Chat chat, String[] strings) {
        StringBuilder messageBuilder = new StringBuilder();
        String userName = user.getFirstName() + " " + user.getLastName();

        /*
        if(userManager already knows the user)
                faNiente()
        else
            stampa un messaggio introduttivo
         */

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