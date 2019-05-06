package it.unipd.dstack.butterfly.producer.gitlab.testutils;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class BrokerTest<T> {
    /**
     * Key: the topic.
     * Value: the list of values for the given topic.
     */
    private Map<String, List<T>> broker = new HashMap<>();

    private static <V> List<V> createList(String key) {
        return new ArrayList<>();
    }

    public void publishToTopic(String topic, T data) {
        this.broker.computeIfAbsent(topic, BrokerTest::createList).add(data);
    }

    public List<T> getDataByTopic(String topic) {
        List<T> value = this.broker.get(topic);
        return value;
    }

    public void clear() {
        this.broker.clear();
    }
}
