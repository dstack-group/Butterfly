package it.unipd.dstack.butterfly.consumer.consumer;

import it.unipd.dstack.butterfly.common.config.ConfigManager;

import java.util.List;

@FunctionalInterface
public interface ConsumerFactory<T> {
    /**
     * Given a callback and a list of topics to subscribe to, creates a new Consumer concrete implementation
     * @param onConsumedMessage the callback invoked when a new message is read from the broker
     * @return
     */
    Consumer createConsumer(ConfigManager configManager,
                            OnConsumedMessage<T> onConsumedMessage,
                            List<String> topicList);
}
