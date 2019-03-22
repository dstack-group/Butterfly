package it.unipd.dstack.butterfly.consumer.email;

import it.unipd.dstack.butterfly.consumer.consumer.ConsumerImplFactory;

public class Main {
    public static void main(String[] args) {
        EmailConsumerController emailConsumerController = new EmailConsumerController(new ConsumerImplFactory<>());
        emailConsumerController.start();
    }
}
