package it.unipd.dstack.butterfly.producer.testutils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class BrokerTest<T> {
    private Logger logger = LoggerFactory.getLogger(BrokerTest.class);
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
        logger.info("inserted data: " + data.toString());
        logger.error("inserted data: " + data.toString());
    }

    public List<T> getDataByTopic(String topic) {
        List<T> value = this.broker.get(topic);
        return value;
    }

    public void clear() {
        this.broker.clear();
    }
}
