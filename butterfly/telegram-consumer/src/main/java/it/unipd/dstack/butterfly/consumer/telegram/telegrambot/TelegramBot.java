package it.unipd.dstack.butterfly.consumer.telegram.telegrambot;

import it.unipd.dstack.butterfly.config.ConfigManager;
import org.slf4j.Logger;
import org.telegram.telegrambots.bots.TelegramLongPollingBot;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.api.objects.Update;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;

import static org.slf4j.LoggerFactory.getLogger;

public class TelegramBot extends TelegramLongPollingBot {

    private static final Logger LOGGER = getLogger(TelegramBot.class);
    /*
    static fields
     */
    private final String token;
    private final String botName;

    public TelegramBot() {
        this.token = ConfigManager.getStringProperty("TELEGRAM_TOKEN", "577704603:AAFWyfXNdZOXx8nx0y9jo-lIPljvSDvUyYY");
        this.botName = ConfigManager.getStringProperty("TELEGRAM_BOT_NAME", "ProtoTelegramBot");
    }

    public String getBotUsername() {
        return botName;
    }

    public String getBotToken() {
        return token;
    }

    public void onUpdateReceived(Update update) {
        if (update.hasMessage()) {
            long chatId = update.getMessage().getChatId();

            //  TODO add the chatId of a specific user to DB (only once)
            /*
                add implementation here
             */

            //  DEBUG
            LOGGER.debug("received update with text {}", update.getMessage().getText());
            sendMessage(update.getMessage().getChatId(), update.getMessage().getText());
        }
    }

    /**
     * Method for sending a message.
     *
     * @param chatId         User chat id.
     * @param messageContent The string you want to send.
     */
    public synchronized void sendMessage(Long chatId, String messageContent) {
        try {
            // chat_id can be obtained here with a query.
            SendMessage sm = new SendMessage(chatId, messageContent);
            execute(sm);
        } catch (TelegramApiException e) {
            LOGGER.error("Could not send message with chat_id={0} and content={1} ", chatId, messageContent);
            LOGGER.error(e.getMessage());
        }
    }
}
