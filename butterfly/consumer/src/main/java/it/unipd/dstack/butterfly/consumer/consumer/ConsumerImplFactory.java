package it.unipd.dstack.butterfly.consumer.consumer;

import java.util.List;

public class ConsumerImplFactory<T> implements ConsumerFactory<T> {
    /**
     * Creates a new Consumer concrete implementation given a callback
     *
     * @param onConsumedMessage the callback invoked when a new message is read from the broker
     * @return
     */
    @Override
    public Consumer createConsumer(OnConsumedMessage<T> onConsumedMessage, List<String> topicList) {
        var consumer = new ConsumerImpl<>(onConsumedMessage);
        consumer.subscribe(topicList);
        return consumer;
    }
}
