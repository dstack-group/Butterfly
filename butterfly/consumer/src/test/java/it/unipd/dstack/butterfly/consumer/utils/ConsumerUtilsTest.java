package it.unipd.dstack.butterfly.consumer.utils;

import it.unipd.dstack.butterfly.consumer.utils.EnumTesting;
import it.unipd.dstack.butterfly.consumer.utils.ConsumerUtils;
import it.unipd.dstack.butterfly.controller.record.Record;
import org.apache.kafka.common.TopicPartition;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecords;

import java.util.Arrays;
import java.util.List;
import java.util.ArrayList;
import java.util.Map;
import java.util.HashMap;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.contains;

public class ConsumerUtilsTest {


    /**
     *  <p>Check if the getListFromSingleton method returns a List with only the element received in input<p>
     *
     *  @author DStack Group
     *  @return void
     */

    @Test
    public void shouldReturnAListFromASingletonItem() {

        List<Integer> integerList = Arrays.asList(12345);
        List<Integer> firstResult = ConsumerUtils.getListFromSingleton(12345);
        assertEquals(integerList, firstResult);
        assertEquals(1, firstResult.size());

        List<String> stringList = Arrays.asList("Testing");
        List<String> secondResult = ConsumerUtils.getListFromSingleton("Testing");
        assertEquals(stringList, secondResult);
        assertEquals(1, secondResult.size());
    }


    /**
     *  <p>Check if the consumerRecordsToList method returns:</p>
     *  <ul>
     *    <li>A list that contains all the Records consumed</li>
     *    <li>A list with the expected size</li>
     *  </ul>
     *
     *  @author DStack Group
     *  @return void
     */

    @Test
    public void shouldReturnAListOfRecordFromConsumerRecords() {
        
        TopicPartition topicPartition = new TopicPartition("Topic", 0);

        List<ConsumerRecord<String, String>> consumerRecordList = new ArrayList<>();
        consumerRecordList.add(new ConsumerRecord("Topic", 0, 0, "Key0", "Value0"));
        consumerRecordList.add(new ConsumerRecord("Topic", 0, 1, "Key1", "Value1"));
        consumerRecordList.add(new ConsumerRecord("Topic", 0, 2, "Key2", "Value2"));

        Map<TopicPartition, List<ConsumerRecord<String, String>>> recordMap = new HashMap<>();
        recordMap.put(topicPartition, consumerRecordList);

        ConsumerRecords<String, String> consumerRecordsMap = new ConsumerRecords(recordMap);

        List<Record<String>> result = ConsumerUtils.consumerRecordsToList(consumerRecordsMap);

        assertEquals(consumerRecordList.size(), result.size());
        assertEquals("Value0", result.get(0).getData());
        assertEquals("Value1", result.get(1).getData());
        assertEquals("Value2", result.get(2).getData());

        for(Record record: result) {
            assertEquals("Topic", record.getTopic());
        }
    }


    /**
     *  <p>Check if the getListFromCommaSeparatedString method returns:</p>
     *  <ul>
     *    <li>A list that contains the right strings</li>
     *    <li>A list with the expected size</li>
     *  </ul>
     *
     *  @author DStack Group
     *  @return void
     */

    @Test
    public void shouldReturnAListOfCommaSeparatedStrings() {

        List<String> expected = Arrays.asList("This,is,a,simple,test");

        List<String> result = ConsumerUtils.getListFromCommaSeparatedString("This,is,a,simple,test");

        // Check if the list contains exactly these strings and in that order
        assertThat(result, contains("This", "is", "a", "simple", "test"));
        assertEquals(5, result.size());
    }


    /**
     *  <p>Check if the getLowerCaseTopicFromEnum method returns a lower case string translated from the input enum</p>
     *
     *  @author DStack Group
     *  @return void
     */

    @Test
    public void shouldReturnALowerCaseStringFromEnum() {

        // Testing all uppercase letters
        assertEquals("topic_sonarqube", ConsumerUtils.getLowerCaseTopicFromEnum("TOPIC_", EnumTesting.SONARQUBE));

        // Testing misc uppercase and lowercase letters
        assertEquals("topic_telegram", ConsumerUtils.getLowerCaseTopicFromEnum("ToPiC_", EnumTesting.TeLeGraM));

        // Testing all lowercase letters
        assertEquals("topic_slack", ConsumerUtils.getLowerCaseTopicFromEnum("topic_", EnumTesting.slack));
   }
}
