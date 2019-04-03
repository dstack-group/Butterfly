package it.unipd.dstack.butterfly.consumer.telegram;

import it.unipd.dstack.butterfly.common.config.AbstractConfigManager;
import it.unipd.dstack.butterfly.common.config.EnvironmentConfigManager;
import it.unipd.dstack.butterfly.consumer.consumer.ConsumerImplFactory;
import it.unipd.dstack.butterfly.consumer.telegram.formatstrategy.TelegramFormatStrategy;
import it.unipd.dstack.butterfly.consumer.telegram.telegrambot.TelegramBot;
import it.unipd.dstack.butterfly.consumer.telegram.telegrambot.TelegramBotAdapterImpl;
import it.unipd.dstack.butterfly.consumer.telegram.telegrambot.handler.commands.EmailCommand;
import it.unipd.dstack.butterfly.consumer.telegram.telegrambot.handler.commands.StartCommand;
import it.unipd.dstack.butterfly.consumer.telegram.telegrambot.handler.CommandHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class Main {
    private static final Logger logger = LoggerFactory.getLogger(Main.class);

    public static void main(String[] args) {
        AbstractConfigManager configManager = new EnvironmentConfigManager();
        String token = configManager.getStringProperty("TELEGRAM_TOKEN", "577704603:AAFWyfXNdZOXx8nx0y9jo-lIPljvSDvUyYY");
        String botName = configManager.getStringProperty("TELEGRAM_BOT_NAME", "ProtoTelegramBot");

        CommandHandler commandHandler = new CommandHandler();
        commandHandler.register(new StartCommand());
        commandHandler.register(new EmailCommand());

        TelegramBot telegramBot = new TelegramBotAdapterImpl(token, botName, commandHandler);
        telegramBot.init();

        TelegramFormatStrategy formatStrategy = new TelegramFormatStrategy();

        TelegramConsumerController telegramConsumerController =
                new TelegramConsumerController(configManager, new ConsumerImplFactory<>(), telegramBot, formatStrategy);
        telegramConsumerController.start();
    }
}
