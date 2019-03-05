package it.unipd.dstack.butterfly.producer.helpers;

public class Util {
    public static void gracefulShutdown(Runnable shutdownTask) {
        Thread shutdownThread = new Thread(shutdownTask);
        Runtime.getRuntime()
                .addShutdownHook(shutdownThread);
    }
}
