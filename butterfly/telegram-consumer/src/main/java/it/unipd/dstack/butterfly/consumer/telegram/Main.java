package it.unipd.dstack.butterfly.consumer.telegram;

import it.unipd.dstack.butterfly.config.AbstractConfigManager;
import it.unipd.dstack.butterfly.config.EnvironmentConfigManager;
import it.unipd.dstack.butterfly.eventprocessor.EventProcessor;
import it.unipd.dstack.butterfly.consumer.consumer.ConsumerImplFactory;
import it.unipd.dstack.butterfly.consumer.telegram.formatstrategy.TelegramFormatStrategy;
import it.unipd.dstack.butterfly.consumer.telegram.telegrambot.TelegramBot;
import it.unipd.dstack.butterfly.consumer.telegram.telegrambot.TelegramBotAdapterImpl;
import it.unipd.dstack.butterfly.consumer.telegram.telegrambot.handler.commands.CommandRegister;
import it.unipd.dstack.butterfly.consumer.telegram.telegrambot.handler.commands.CommandRegisterImpl;
import it.unipd.dstack.butterfly.consumer.telegram.telegrambot.handler.commands.EmailCommand;
import it.unipd.dstack.butterfly.consumer.telegram.telegrambot.handler.commands.StartCommand;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class Main {
    private static final Logger logger = LoggerFactory.getLogger(Main.class);

    public static void main(String[] args) {
        AbstractConfigManager configManager = new EnvironmentConfigManager();
        String token = configManager.getStringProperty("TELEGRAM_TOKEN", "577704603:AAFWyfXNdZOXx8nx0y9jo-lIPljvSDvUyYY");
        String botName = configManager.getStringProperty("TELEGRAM_BOT_NAME", "ProtoTelegramBot");

        String userManagerUrl = configManager.getStringProperty("USER_MANAGER_URL");
        int userManagerRequestTimeout = configManager.getIntProperty("USER_MANAGER_REQUEST_TIMEOUT_MS");
        int userManagerThreadsNumber = configManager.getIntProperty("USER_MANAGER_THREADS");

        EventProcessor eventProcessor = new EventProcessor.Builder()
                .setUserManagerURL(userManagerUrl)
                .setTimeoutInMs(userManagerRequestTimeout)
                .setThreadsNumber(userManagerThreadsNumber)
                .build();

        CommandRegister commandRegister = new CommandRegisterImpl();
        commandRegister.register(new StartCommand());
        commandRegister.register(new EmailCommand(eventProcessor));

        TelegramBot telegramBot = new TelegramBotAdapterImpl(token, botName, commandRegister);

        TelegramFormatStrategy formatStrategy = new TelegramFormatStrategy();

        TelegramConsumerController telegramConsumerController =
                new TelegramConsumerController(configManager, new ConsumerImplFactory<>(), telegramBot, formatStrategy);
        telegramConsumerController.start();
    }
}
