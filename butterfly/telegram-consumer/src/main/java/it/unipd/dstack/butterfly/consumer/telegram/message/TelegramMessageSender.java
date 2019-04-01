package it.unipd.dstack.butterfly.consumer.telegram.message;

@FunctionalInterface
public interface TelegramMessageSender {
    /**
     * Sends the specified TelegramMessage.
     * @param message
     */
    void send(TelegramMessage message) throws Exception;
}
