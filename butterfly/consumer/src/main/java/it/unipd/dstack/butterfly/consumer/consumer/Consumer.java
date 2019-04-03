package it.unipd.dstack.butterfly.consumer.consumer;

public interface Consumer<T> extends ConsumerReceiver, Closeable, Subject<T> {
    void start();
}
