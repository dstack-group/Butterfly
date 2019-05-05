/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    consumer
 * @fileName:  ConsumerImpl.java
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 * ConsumerImpl wraps the usage of a KafkaConsumer client to receive messages from Apache Kafka.
 * This class is the default implementation of the Consumer interface. It also extends AbstractSubject, which
 * allows it to notify about new consumed messages via the Observer Pattern, instead of exposing the verbose
 * old school loop/poll API that the KafkaConsumer class requires.
 * By default KafkaConsumer isn't thread-safe.
 */

package it.unipd.dstack.butterfly.consumer.consumer;

import it.unipd.dstack.butterfly.config.AbstractConfigManager;
import it.unipd.dstack.butterfly.controller.record.Record;
import it.unipd.dstack.butterfly.consumer.utils.ConsumerUtils;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.Duration;
import java.util.List;
import java.util.Properties;
import java.util.concurrent.atomic.AtomicBoolean;

public class ConsumerImpl <V> extends AbstractSubject<V> implements Consumer<V> {
    private static final Logger logger = LoggerFactory.getLogger(ConsumerImpl.class);

    private KafkaConsumer<String, V> kafkaConsumer;
    private final Duration pollDuration;
    private final AtomicBoolean closed = new AtomicBoolean(false);
    private final AtomicBoolean waitingForCommit = new AtomicBoolean(false);

    /**
     * If set to true, it means that no other record is read until a manual commit on the previously read records
     * is performed. This is due to the fact that KafkaConsumer isn't thread safe, and wrapping the
     * {@link#commitSync() commitSync) method definition with a synchronized block isn't sufficient.
     */
    private final boolean mustManuallyCommit;

    public ConsumerImpl(AbstractConfigManager configManager) {
        this.kafkaConsumer = ConsumerImpl.createKafkaConsumer(configManager);
        this.mustManuallyCommit = !configManager.getBooleanProperty("KAFKA_ENABLE_AUTO_COMMIT_CONFIG", true);

        int pollDurationMs = configManager.getIntProperty("KAFKA_POLL_DURATION_MS", 2000);
        this.pollDuration = Duration.ofMillis(pollDurationMs);
    }

    private static <K, V> KafkaConsumer<K, V> createKafkaConsumer(AbstractConfigManager configManager) {
        Properties properties = KafkaConsumerProperties.defaultKafkaConsumerPropertiesFactory(configManager);
        return new KafkaConsumer<>(properties);
    }

    /**
     * Subscribes to the given list of topics to get dynamically assigned partitions.
     *
     * @param topicList
     */
    @Override
    public void subscribe(List<String> topicList) {
        this.kafkaConsumer.subscribe(topicList);
    }

    /**
     * Starts consuming messages. The current consumer must have already been initialized
     * with {@link#subscribe(List<String>) subscribe(List < String >)}.
     */
    @Override
    public void start() {
        if (logger.isInfoEnabled()) {
            logger.info(String.format("Consumer started in thread %s", Thread.currentThread().getId()));
        }

        if (this.mustManuallyCommit) {
            this.consumeWithManualCommitLoop();
        } else {
            this.consumeWithAutomaticCommitLoop();
        }
    }

    /**
     * Synchronously commits the latest batch of messages read from the consumer.
     * This method should only be called when the configuration <pre>KAFKA_ENABLE_AUTO_COMMIT_CONFIG</pre> is set
     * to false. This method is a thread-safe implementation of
     * {@link#KafkaConsumer.commitSync() KafkaConsumer.commitSync()}, which isn't thread-safe.
     */
    @Override
    public void commitSync() {
        if (logger.isInfoEnabled()) {
            logger.info(String.format("Called commitSync in thread %s", Thread.currentThread().getId()));
        }

        synchronized (this) {
            if (this.waitingForCommit.get()) {
                try {
                    this.kafkaConsumer.commitSync();

                    if (logger.isInfoEnabled()) {
                        logger.info("Completed commitSync");
                    }
                } catch (Exception e) {
                    this.close();
                } finally {
                    this.waitingForCommit.set(false);
                    /**
                     * In order to guarantee thread-safety when manual committing, the consume loop had to be stopped.
                     * That's why we need to spin it up again after a successful commit.
                     */
                    this.consumeWithManualCommitLoop();
                }
            }
        }
    }

    /**
     * Releases any system resources associated with the current object.
     */
    @Override
    public void close() {
        this.closed.set(true);
        this.kafkaConsumer.close();
        super.removeObservers();
    }

    /**
     * This is the default consume loop. It continuously polls the broker for new records to consume until
     * the current consumer is closed.
     */
    private void consumeWithAutomaticCommitLoop() {
        while (!this.closed.get()) {
            this.consumeAndNotify();
        }
    }

    /**
     * This is the consume loop that should be called whenever there's a need for a granular commit policy for
     * the consumed records. It exits the consume loop whenever a batch of more than 0 messages is read.
     * In order to be restarted, {@link#commitSync() commitSync()} must be called.
     */
    private void consumeWithManualCommitLoop() {
        synchronized (this) {
            while (!this.waitingForCommit.get() && !this.closed.get()) {
                this.consumeAndNotify();
            }
        }
    }

    /**
     * This method continuously reads for new records to consume and notifies the subscribers about the new messages
     * whenever they arrive.
     * It enhances the tedious while/pool mechanism required by KafkaConsumer by exposing an elegant and more
     * practical API via the Observer pattern.
     */
    private void consumeAndNotify() {
        try {
            ConsumerRecords<String, V> consumerRecordList = kafkaConsumer.poll(this.pollDuration);
            List<Record<V>> recordList = ConsumerUtils.consumerRecordsToList(consumerRecordList);

            if (recordList.size() > 0) {
                recordList.forEach(super::notifyObservers);

                if (this.mustManuallyCommit) {
                    this.waitingForCommit.set(true);
                }
            }
        } catch (Exception e) {
            if (logger.isErrorEnabled()) {
                logger.error(String.format("Error consuming in ConsumerImpl: %s", e));
            }
        }
    }
}
