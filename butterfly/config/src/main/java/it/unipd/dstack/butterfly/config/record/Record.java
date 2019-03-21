package it.unipd.dstack.butterfly.config.record;

/**
 * Object that stores the topic in which the data should be sent, and the data itself
 * @param <T>
 */
public class Record <T> {
    private String topic;
    private T data;

    public Record(String topic, T data) {
        this.topic = topic;
        this.data = data;
    }

    public String getTopic() {
        return topic;
    }

    public T getData() {
        return data;
    }
}
