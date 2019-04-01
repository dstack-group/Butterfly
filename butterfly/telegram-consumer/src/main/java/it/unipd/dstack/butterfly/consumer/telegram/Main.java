package it.unipd.dstack.butterfly.consumer.telegram;

import it.unipd.dstack.butterfly.common.config.ConfigManager;
import it.unipd.dstack.butterfly.common.config.EnvironmentConfigManager;
import it.unipd.dstack.butterfly.consumer.consumer.ConsumerImplFactory;
import it.unipd.dstack.butterfly.consumer.telegram.formatstrategy.TelegramFormatStrategy;
import it.unipd.dstack.butterfly.consumer.telegram.telegrambot.TelegramBot;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.telegram.telegrambots.ApiContextInitializer;
import org.telegram.telegrambots.meta.TelegramBotsApi;
import org.telegram.telegrambots.meta.exceptions.TelegramApiRequestException;

public class Main {
    private static final Logger logger = LoggerFactory.getLogger(Main.class);

    public static void main(String[] args) {
        ConfigManager configManager = new EnvironmentConfigManager();

        // TODO: move into a TelegramBot class
        ApiContextInitializer.init();

        String token = configManager.getStringProperty("TELEGRAM_TOKEN", "577704603:AAFWyfXNdZOXx8nx0y9jo-lIPljvSDvUyYY");
        String botName = configManager.getStringProperty("TELEGRAM_BOT_NAME", "ProtoTelegramBot");

        TelegramBot bot = new TelegramBot(token, botName);
        TelegramBotsApi botsApi = new TelegramBotsApi();
        try {
            botsApi.registerBot(bot);
        } catch (TelegramApiRequestException e) {
            logger.error("TELEGRAM CONSUMER bot error", e.toString());
        }

        TelegramFormatStrategy formatStrategy = new TelegramFormatStrategy();

        TelegramConsumerController telegramConsumerController =
                new TelegramConsumerController(configManager, new ConsumerImplFactory<>(), bot, formatStrategy);
        telegramConsumerController.start();
    }
}
