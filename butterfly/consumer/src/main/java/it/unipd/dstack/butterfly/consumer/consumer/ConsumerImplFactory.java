package it.unipd.dstack.butterfly.consumer.consumer;

import it.unipd.dstack.butterfly.config.AbstractConfigManager;

import java.util.List;

public class ConsumerImplFactory<T> implements ConsumerFactory<T> {
    /**
     * Given a configuration manager and a list of topics to subscribe to, creates a new Consumer concrete
     * implementation.
     * @param configManager the configuration manager implementation that allows reading consumer properties.
     * @param topicList the list of topics to subscribe to.
     * @return
     */
    @Override
    public Consumer createConsumer(
            AbstractConfigManager configManager,
            List<String> topicList) {
        var consumer = new ConsumerImpl<>(configManager);
        consumer.subscribe(topicList);
        return consumer;
    }
}
