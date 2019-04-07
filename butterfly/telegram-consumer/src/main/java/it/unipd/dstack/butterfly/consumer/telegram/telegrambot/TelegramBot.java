package it.unipd.dstack.butterfly.consumer.telegram.telegrambot;


import it.unipd.dstack.butterfly.consumer.telegram.message.TelegramMessage;

public interface TelegramBot {
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
