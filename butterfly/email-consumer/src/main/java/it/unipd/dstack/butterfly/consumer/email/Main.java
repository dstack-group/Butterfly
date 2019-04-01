package it.unipd.dstack.butterfly.consumer.email;

import it.unipd.dstack.butterfly.common.config.ConfigManager;
import it.unipd.dstack.butterfly.common.config.EnvironmentConfigManager;
import it.unipd.dstack.butterfly.consumer.consumer.ConsumerImplFactory;

public class Main {
    public static void main(String[] args) {
        ConfigManager configManager = new EnvironmentConfigManager();

        EmailFormatStrategy emailFormatStrategy = new EmailFormatStrategy();
        EmailConsumerController emailConsumerController =
                new EmailConsumerController(configManager, new ConsumerImplFactory<>(), emailFormatStrategy);
        emailConsumerController.start();
    }
}
