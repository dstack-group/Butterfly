package it.unipd.dstack.butterfly.consumer.consumer;

import java.util.List;

public interface ConsumerReceiver {

    /**
     * Subscribes to a single topic.
     * @param topic
     */
    void subscribe(String topic);

    /**
     * Subscribes to the given list of topics to get dynamically assigned partitions.
     * @param topicList
     */
    void subscribe(List<String> topicList);
}
