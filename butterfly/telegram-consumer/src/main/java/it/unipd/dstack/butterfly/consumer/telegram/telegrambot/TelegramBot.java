package it.unipd.dstack.butterfly.consumer.telegram.telegrambot;

import it.unipd.dstack.butterfly.config.ConfigManager;
import it.unipd.dstack.butterfly.consumer.consumer.message.MessageSender;
import it.unipd.dstack.butterfly.consumer.telegram.message.TelegramMessage;
import org.slf4j.Logger;
import org.telegram.telegrambots.bots.TelegramLongPollingBot;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.api.objects.Update;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;

import static org.slf4j.LoggerFactory.getLogger;

public class TelegramBot extends TelegramLongPollingBot implements MessageSender<TelegramMessage> {

    private static final Logger logger = getLogger(TelegramBot.class);
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
            // long chatId = update.getMessage().getChatId();

            //  TODO add the chatId of a specific user to DB (only once)
            /*
                add implementation here
             */

            //  DEBUG
            logger.debug("received update with text {}", update.getMessage().getText());
            TelegramMessage telegramMessage =
                    new TelegramMessage(update.getMessage().getChatId().toString(), update.getMessage().getText());
            try {
                this.sendMessage(telegramMessage);
            } catch (TelegramApiException e) {
                logger.error("Could not sendMessage message");
                logger.error(e.getMessage());
            }
        }
    }

    /**
     * Forwards the given messaage to the appropriate service.
     *
     * @param message
     */
    @Override
    public void sendMessage(TelegramMessage message) throws TelegramApiException {
        SendMessage sm = new SendMessage(message.getRecipient(), message.getContent());
        execute(sm);
    }
}
