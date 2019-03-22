package it.unipd.dstack.butterfly.consumer.consumer;

public interface Consumer extends ConsumerReceiver, Closeable {
    void start();
}
