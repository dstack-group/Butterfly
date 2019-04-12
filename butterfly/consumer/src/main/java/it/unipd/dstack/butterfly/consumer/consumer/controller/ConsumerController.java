package it.unipd.dstack.butterfly.consumer.consumer.controller;

import it.unipd.dstack.butterfly.config.AbstractConfigManager;
import it.unipd.dstack.butterfly.controller.Controller;
import it.unipd.dstack.butterfly.controller.record.Record;
import it.unipd.dstack.butterfly.consumer.consumer.Consumer;
import it.unipd.dstack.butterfly.consumer.consumer.ConsumerFactory;
import it.unipd.dstack.butterfly.consumer.utils.ConsumerUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

public abstract class ConsumerController<T> implements Controller {
    private static final Logger logger = LoggerFactory.getLogger(ConsumerController.class);

    protected final AbstractConfigManager configManager;
    protected final String serviceName;
    protected final List<String> topicList;
    protected final Consumer<T> consumer;

    public ConsumerController(AbstractConfigManager configManager, ConsumerFactory<T> consumerFactory) {
        this(
                configManager,
                consumerFactory,
                ConsumerUtils.getListFromSingleton(configManager.getStringProperty("KAFKA_TOPIC"))
        );
    }

    public ConsumerController(AbstractConfigManager configManager, ConsumerFactory<T> consumerFactory, List<String> topicList) {
        this.configManager = configManager;
        this.serviceName = configManager.getStringProperty("SERVICE_NAME");
        this.topicList = topicList;
        this.consumer = consumerFactory.createConsumer(configManager, topicList);

        this.consumer.addObserver(this::onMessageConsume);
        this.consumer.addObserver(this::onMessageConsumeLog);

        /**
         * Graceful shutdown
         */
        this.gracefulShutdown();
    }

    /**
     * Spins up the controller
     */
    public final void start() {
        if (logger.isInfoEnabled()) {
            logger.info(String.format("%s started", this.serviceName));
        }
        this.consumer.start();
    }

    /**
     * Closes the controller and releases resources.
     */
    public final void close() {
        if (logger.isInfoEnabled()) {
            logger.info(String.format("Closing %s", this.serviceName));
        }
        // terminates the production process
        this.consumer.close();
        this.releaseResources();

        if (logger.isInfoEnabled()) {
            logger.info(String.format("Released resources %s", this.serviceName));
        }
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

    private void onMessageConsumeLog(Record<T> record) {
        if (logger.isInfoEnabled()) {
            logger.info(String.format("New record received: %s", record.getTopic()));
        }
    }
}
