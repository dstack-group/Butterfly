package it.unipd.dstack.butterfly.consumer.telegram;

import it.unipd.dstack.butterfly.consumer.consumer.ConsumerImplFactory;
import it.unipd.dstack.butterfly.consumer.telegram.telegrambot.TelegramBot;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.telegram.telegrambots.ApiContextInitializer;
import org.telegram.telegrambots.meta.TelegramBotsApi;
import org.telegram.telegrambots.meta.exceptions.TelegramApiRequestException;

public class Main {
    private static final Logger logger = LoggerFactory.getLogger(Main.class);

    public static void main(String[] args) {
        ApiContextInitializer.init();
        TelegramBot bot = new TelegramBot();
        TelegramBotsApi botsApi = new TelegramBotsApi();
        try {
            botsApi.registerBot(bot);
        } catch (TelegramApiRequestException e) {
            logger.error("TELEGRAM CONSUMER bot error", e.toString());
        }

        TelegramConsumerController telegramConsumerController =
                new TelegramConsumerController(new ConsumerImplFactory<>(), bot);
        telegramConsumerController.start();
    }
}
