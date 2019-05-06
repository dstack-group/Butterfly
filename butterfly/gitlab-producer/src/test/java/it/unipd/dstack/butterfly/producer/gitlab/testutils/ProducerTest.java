package it.unipd.dstack.butterfly.producer.gitlab.testutils;

import it.unipd.dstack.butterfly.controller.record.Record;
import it.unipd.dstack.butterfly.producer.producer.Producer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.concurrent.CompletableFuture;
import java.util.function.Consumer;

public class ProducerTest<T> implements Producer<T> {
    private BrokerTest<T> broker;
    private Logger logger = LoggerFactory.getLogger(ProducerTest.class);

    public ProducerTest(BrokerTest<T> broker) {
        this.broker = broker;
    }

    /**
     * Blocks the current thread until an error is thrown or until the close() method is called.
     *
     * @param onError action to be run when an error is thrown
     */
    @Override
    public void awaitUntilError(Consumer<Exception> onError) {
        /*
        Exception error = null;
        try {
            this.latch.await();
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt(); // set interrupt flag
            error = e;
        } catch (RuntimeException e) {
            error = e;
        } finally {
            this.latch.countDown();
            onError.accept(error);
        }
        */
    }

    /**
     * Releases any system resources associated with the current object.
     */
    @Override
    public void close() {
        this.broker.clear();
    }

    /**
     * Asynchronously produce a Record element
     *
     * @param record
     * @return
     */
    @Override
    public CompletableFuture<Void> send(Record<T> record) {
        logger.info("publishing into kafka broker test...");
        logger.info("data inserted into broker test: " + record.getData().toString());
        return CompletableFuture.runAsync(() -> this.broker.publishToTopic(record.getTopic(), record.getData()));
    }
}
