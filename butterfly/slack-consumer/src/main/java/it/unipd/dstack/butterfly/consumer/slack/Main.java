package it.unipd.dstack.butterfly.consumer.slack;

import it.unipd.dstack.butterfly.config.AbstractConfigManager;
import it.unipd.dstack.butterfly.config.EnvironmentConfigManager;
import it.unipd.dstack.butterfly.consumer.consumer.ConsumerImplFactory;
import it.unipd.dstack.butterfly.consumer.slack.formatstrategy.SlackFormatStrategy;

public class Main {
    public static void main(String[] args) {
        AbstractConfigManager configManager = new EnvironmentConfigManager();

        SlackFormatStrategy slackFormatStrategy = new SlackFormatStrategy();
        SlackConsumerController slackConsumerController =
                new SlackConsumerController(configManager, new ConsumerImplFactory<>(), slackFormatStrategy);
        slackConsumerController.start();
    }
}
