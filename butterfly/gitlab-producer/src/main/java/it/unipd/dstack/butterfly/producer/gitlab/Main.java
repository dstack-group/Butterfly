package it.unipd.dstack.butterfly.producer.gitlab;

import it.unipd.dstack.butterfly.producer.producer.ProducerImpl;

public class Main {
    public static void main(String[] args) {
        GitlabProducerController gitlabProducerController = new GitlabProducerController(new ProducerImpl<>());
        gitlabProducerController.start();
    }
}
