package it.unipd.dstack.butterfly.consumer.email;

public class Main {
    public static void main(String[] args) {
        EmailConsumerController emailConsumerController = new EmailConsumerController();
        emailConsumerController.start();

        /**
         * Graceful shutdown
         */
        Runtime.getRuntime()
                .addShutdownHook(new Thread(emailConsumerController::close));
    }
}
