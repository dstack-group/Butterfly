package it.unipd.dstack.butterfly.consumer.telegram;

import org.telegram.telegrambots.ApiContextInitializer;

public class Main {
    public static void main(String[] args) {

        ApiContextInitializer.init();
        TelegramConsumerController telegramConsumerController = new TelegramConsumerController();
        telegramConsumerController.start();
    }
}
