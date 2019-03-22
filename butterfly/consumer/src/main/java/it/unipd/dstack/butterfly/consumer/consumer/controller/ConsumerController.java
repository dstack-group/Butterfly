package it.unipd.dstack.butterfly.consumer.consumer.controller;

import it.unipd.dstack.butterfly.config.ConfigManager;
import it.unipd.dstack.butterfly.config.controller.Controller;
import it.unipd.dstack.butterfly.config.record.Record;
import it.unipd.dstack.butterfly.consumer.consumer.Consumer;
import it.unipd.dstack.butterfly.consumer.consumer.ConsumerFactory;
import it.unipd.dstack.butterfly.consumer.utils.ConsumerUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

public abstract class ConsumerController<T> implements Controller {
    private static final Logger logger = LoggerFactory.getLogger(ConsumerController.class);

    protected final String serviceName;
    protected final List<String> topicList;
    protected final Consumer consumer;

    public ConsumerController(ConsumerFactory<T> consumerFactory) {
        this(consumerFactory, ConsumerUtils.getListFromSingleton(ConfigManager.getStringProperty("KAFKA_TOPIC")));
    }

    public ConsumerController(ConsumerFactory<T> consumerFactory, List<String> topicList) {
        this.serviceName = ConfigManager.getStringProperty("SERVICE_NAME");
        this.topicList = topicList;
        this.consumer = consumerFactory.createConsumer(this::onMessageConsume, topicList);

        /**
         * Graceful shutdown
         */
        this.gracefulShutdown();
    }

    /**
     * Spins up the controller
     */
    final public void start() {
        logger.info(this.serviceName + " started");
        this.consumer.start();
    }

    /**
     * Closes the controller and releases resources.
     */
    final public void close() {
        logger.info("Closing " + this.serviceName);
        // terminates the production process
        this.consumer.close();
        this.releaseResources();
        logger.info("Released resources " + this.serviceName);
    }

    /**
     * Called when a new record is received from the broker.
     * @param record
     */
    protected abstract void onMessageConsume(Record<T> record);

    /**
     * Releases ConsumerController's implementation's resources
     */
    protected void releaseResources() {
        // NO-OP if it isn't overridden
    }
}
