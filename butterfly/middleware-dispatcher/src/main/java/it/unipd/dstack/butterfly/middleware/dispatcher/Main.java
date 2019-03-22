package it.unipd.dstack.butterfly.middleware.dispatcher;

import it.unipd.dstack.butterfly.consumer.consumer.ConsumerImplFactory;
import it.unipd.dstack.butterfly.producer.producer.ProducerImpl;

public class Main {
    public static void main(String[] args) {
        MiddlewareDispatcherController middlewareDispatcherController =
                new MiddlewareDispatcherController(new ProducerImpl<>(), new ConsumerImplFactory<>());
        middlewareDispatcherController.start();
    }
}
