package it.unipd.dstack.butterfly.producer.gitlab;

public class Main {
    public static void main(String[] args) {
        GitlabProducerController gitlabProducerController = new GitlabProducerController();
        gitlabProducerController.start();

        /**
         * Graceful shutdown
         */
        Runtime.getRuntime()
                .addShutdownHook(new Thread(gitlabProducerController::close));
    }
}
