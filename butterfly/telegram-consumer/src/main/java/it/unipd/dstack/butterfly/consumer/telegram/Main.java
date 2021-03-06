/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    telegram-consumer
 * @fileName:  Main.java
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

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

public class Main {
    public static void main(String[] args) {
        AbstractConfigManager configManager = new EnvironmentConfigManager();
        String token = configManager.getStringProperty("TELEGRAM_TOKEN");
        String botName = configManager.getStringProperty("TELEGRAM_BOT_NAME");

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
