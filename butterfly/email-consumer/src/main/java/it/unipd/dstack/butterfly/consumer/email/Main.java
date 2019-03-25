package it.unipd.dstack.butterfly.consumer.email;

import it.unipd.dstack.butterfly.consumer.consumer.ConsumerImplFactory;

public class Main {
    public static void main(String[] args) {
        EmailFormatStrategy emailFormatStrategy = new EmailFormatStrategy();
        EmailConsumerController emailConsumerController =
                new EmailConsumerController(new ConsumerImplFactory<>(), emailFormatStrategy);
        emailConsumerController.start();
    }
}
