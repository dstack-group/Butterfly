package it.unipd.dstack.butterfly.consumer.utils;

import it.unipd.dstack.butterfly.controller.record.Record;
import org.apache.kafka.clients.consumer.ConsumerRecords;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public final class ConsumerUtils {
    private ConsumerUtils() {
    }

    public static <T> List<T> getListFromSingleton(T single) {
        return Arrays.asList(single);
    }

    public static <T> List<Record<T>> consumerRecordsToList(ConsumerRecords<String, T> consumerRecordList) {
        List<Record<T>> recordList = new ArrayList<>();
        consumerRecordList.iterator().forEachRemaining(consumerRecord -> {
            recordList.add(new Record<>(consumerRecord.topic(), consumerRecord.value()));
        });
        return recordList;
    }

    /**
     * Utility to retrieve a list of topics from a single string.
     * Example:
     * commaSeparatedValue: "TOPIC_1,TOPIC2,TOPIC3"
     * result: {"TOPIC_1", "TOPIC_2", "TOPIC_3"}
     *
     * @param commaSeparatedValue
     * @return
     */
    public static List<String> getListFromCommaSeparatedString(String commaSeparatedValue) {
        return Arrays.asList(commaSeparatedValue.split(","));
    }

    /**
     * Given a topic prefix string and an enum representing a service,
     * it returns a combination of the two elements. The result is guaranteed to be lowercase.
     *
     * @param topicPrefix
     * @param service
     * @return
     */
    public static String getLowerCaseTopicFromEnum(String topicPrefix, Enum service) {
        String topicPostfix = service.toString();
        return String.format("%s%s", topicPrefix, topicPostfix).toLowerCase();
    }
}
