package it.unipd.dstack.butterfly.consumer.email;

import it.unipd.dstack.butterfly.config.AbstractConfigManager;
import it.unipd.dstack.butterfly.config.EnvironmentConfigManager;
import it.unipd.dstack.butterfly.consumer.consumer.ConsumerImplFactory;

public class Main {
    public static void main(String[] args) {
        AbstractConfigManager configManager = new EnvironmentConfigManager();

        EmailFormatStrategy emailFormatStrategy = new EmailFormatStrategy();
        EmailConsumerController emailConsumerController =
                new EmailConsumerController(configManager, new ConsumerImplFactory<>(), emailFormatStrategy);
        emailConsumerController.start();
    }
}
