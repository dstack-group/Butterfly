package it.unipd.dstack.butterfly.consumer.telegram.telegrambot;


import it.unipd.dstack.butterfly.consumer.telegram.message.TelegramMessage;

public interface TelegramBot {
    /**
     * Initializes the Telegram bot.
     */
    void init();

    /**
     * Sends message to Telegram
     * @param message the message to send
     */
    void sendMessage(TelegramMessage message);

    /**
     * Releases Telegram Bot resources.
     */
    void close();
}
