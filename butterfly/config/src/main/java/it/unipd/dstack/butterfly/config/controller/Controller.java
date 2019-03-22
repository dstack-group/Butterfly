package it.unipd.dstack.butterfly.config.controller;

public interface Controller {
    /**
     * Spins up the controller.
     */
    void start();

    /**
     * Closes the controller and releases resources.
     */
    void close();

    /**
     * Graceful shutdown
     */
    default void gracefulShutdown() {
        Thread shutdownThread = new Thread(this::close);
        Runtime.getRuntime()
                .addShutdownHook(shutdownThread);
    }
}
