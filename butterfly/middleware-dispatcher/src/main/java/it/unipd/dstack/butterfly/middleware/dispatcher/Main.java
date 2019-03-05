package it.unipd.dstack.butterfly.middleware.dispatcher;

public class Main {
    public static void main(String[] args) {
        MiddlewareDispatcherController middlewareDispatcherController = new MiddlewareDispatcherController();
        middlewareDispatcherController.start();

        /**
         * Graceful shutdown
         */
        Runtime.getRuntime()
                .addShutdownHook(new Thread(middlewareDispatcherController::close));
    }
}
