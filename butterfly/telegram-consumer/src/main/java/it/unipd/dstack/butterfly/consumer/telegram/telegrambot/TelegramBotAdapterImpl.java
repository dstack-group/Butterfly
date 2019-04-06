package it.unipd.dstack.butterfly.consumer.telegram.telegrambot;

import it.unipd.dstack.butterfly.consumer.telegram.message.TelegramMessage;
import it.unipd.dstack.butterfly.consumer.telegram.telegrambot.handler.commands.CommandRegister;
import org.slf4j.Logger;
import org.telegram.telegrambots.ApiContextInitializer;
import org.telegram.telegrambots.bots.TelegramLongPollingBot;
import org.telegram.telegrambots.meta.TelegramBotsApi;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;
import org.telegram.telegrambots.meta.exceptions.TelegramApiRequestException;

import static org.slf4j.LoggerFactory.getLogger;

public class TelegramBotAdapterImpl implements TelegramBot {
    private static final Logger logger = getLogger(TelegramBotAdapterImpl.class);
    private TelegramLongPollingBot bot;

    public TelegramBotAdapterImpl(String token, String botName, CommandRegister commandRegister) {
        this.init(token, botName, commandRegister);
    }

    private void init(String token, String botName, CommandRegister commandRegister) {
        ApiContextInitializer.init();
        TelegramBotsApi botsApi = new TelegramBotsApi();
        this.bot = new TelegramBotListener(token, botName, commandRegister);
        try {
            botsApi.registerBot(this.bot);
        } catch (TelegramApiRequestException e) {
            logger.error("TELEGRAM CONSUMER bot error", e.toString());
        }
    }

    /**
     * Sends message to Telegram
     *
     * @param message the message to send
     */
    @Override
    public void sendMessage(TelegramMessage message) {
        SendMessage telegramSendMessage = new SendMessage(message.getRecipient(), message.getContent());
        try {
            this.bot.execute(telegramSendMessage);
        } catch (TelegramApiException e) {
            throw new TelegramBotException();
        }
    }

    /**
     * Releases Telegram Bot resources.
     */
    @Override
    public void close() {
        try {
            this.bot.clearWebhook();
        } catch (TelegramApiRequestException e) {
            logger.error("Error while closing telegram bot");
        }
    }
}
