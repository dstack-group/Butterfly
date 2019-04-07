package it.unipd.dstack.butterfly.producer.producer;

import it.unipd.dstack.butterfly.config.AbstractConfigManager;
import it.unipd.dstack.butterfly.controller.record.Record;
import it.unipd.dstack.butterfly.producer.utils.ProducerUtils;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Properties;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CountDownLatch;
import java.util.function.Consumer;
import java.util.stream.Collectors;

public class ProducerImpl<V> implements Producer<V> {
    private static final Logger logger = LoggerFactory.getLogger(ProducerImpl.class);
    private KafkaProducer<String, V> kafkaProducer;
    private CountDownLatch latch = new CountDownLatch(1);

    public ProducerImpl(AbstractConfigManager configManager) {
        this.kafkaProducer = createKafkaProducer(configManager);
    }

    /**
     * Provides the default property configuration for Apache Kafka.
     * See https://docs.confluent.io/current/installation/configuration/producer-configs.html
     */
    private static <K, V> KafkaProducer<K, V> createKafkaProducer(AbstractConfigManager configManager) {
        Properties properties = KafkaProducerProperties.getProducerProperties(configManager);
        return new KafkaProducer<>(properties);
    }

    /**
     * Asynchronously produce a Record element
     *
     * @param record
     * @return
     */
    @Override
    public CompletableFuture<Void> send(Record<V> record) {
        return ProducerUtils.getCompletableFuture(callback -> {
            var kafkaRecord = new ProducerRecord<String, V>(record.getTopic(), record.getData());
            this.kafkaProducer.send(kafkaRecord, callback);
        });
    }

    /**
     * Asynchronously produce a list of Record elements
     *
     * @param recordList
     * @return
     */
    @Override
    public CompletableFuture<Void> send(List<Record<V>> recordList) {
        var completableFutureList = recordList
                .stream()
                .map(this::send)
                .collect(Collectors.toList());
        return ProducerUtils.composeFutureList(completableFutureList);
    }

    /**
     * Releases any system resources associated with the current object.
     */
    @Override
    public void close() {
        this.latch.countDown();
        logger.info("Closing Kafka kafkaProducer connection...");
        kafkaProducer.flush();
        kafkaProducer.close();
    }

    /**
     * Blocks the current thread until an error is thrown or until the close() method is called.
     * @param onError action to be run when an error is thrown
     */
    @Override
    public void awaitUntilError(Consumer<Exception> onError) {
        Exception error = null;
        try {
            logger.info("Awaiting on latch");
            this.latch.await();
        } catch (InterruptedException e) {
            logger.error("InterruptingException error: " + e);
            error = e;
        } catch (RuntimeException e) {
            logger.error("RuntimeException error: " + e);
            error = e;
        } finally {
            this.latch.countDown();
            onError.accept(error);
        }
    }
}
