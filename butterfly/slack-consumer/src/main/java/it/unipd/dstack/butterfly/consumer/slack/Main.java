/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    slack-consumer
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

package it.unipd.dstack.butterfly.consumer.slack;

import it.unipd.dstack.butterfly.config.AbstractConfigManager;
import it.unipd.dstack.butterfly.config.EnvironmentConfigManager;
import it.unipd.dstack.butterfly.consumer.consumer.ConsumerImplFactory;
import it.unipd.dstack.butterfly.consumer.slack.formatstrategy.SlackFormatStrategy;
import it.unipd.dstack.butterfly.consumer.slack.slackbot.SlackBot;
import it.unipd.dstack.butterfly.consumer.slack.slackbot.SlackBotAdapterImpl;

public class Main {
    public static void main(String[] args) {
        AbstractConfigManager configManager = new EnvironmentConfigManager();
        String token = configManager.getStringProperty("SLACK_TOKEN");
        SlackBot slackBot = new SlackBotAdapterImpl(token);

        SlackFormatStrategy formatStrategy = new SlackFormatStrategy();

        SlackConsumerController slackConsumerController =
                new SlackConsumerController(configManager, new ConsumerImplFactory<>(), slackBot, formatStrategy);
        slackConsumerController.start();
    }
}
