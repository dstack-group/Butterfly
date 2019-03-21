package it.unipd.dstack.butterfly.consumer.consumer;

public interface Closeable {
    /**
     * Releases any system resources associated with the current object.
     */
    void close();
}
