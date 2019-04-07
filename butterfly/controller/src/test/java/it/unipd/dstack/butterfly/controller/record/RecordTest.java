package it.unipd.dstack.butterfly.controller.record;

import it.unipd.dstack.butterfly.controller.record.Record;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class RecordTest {

    private Record<Integer> integerRecord;
    private Record<String> stringRecord;

    public RecordTest() {
        integerRecord = new Record<Integer>("IntegerTest", 10);
        stringRecord = new Record<String>("StringTest", "Ten");
    }


    /**
     *  <p>Check if the getTopic method returns the Topic string of the Record<p>
     *
     *  @author DStack Group
     *  @return void
     */

    @Test
    public void shouldReturnTopicOfTheRecord() {
        assertEquals("IntegerTest", integerRecord.getTopic());
        assertEquals("StringTest", stringRecord.getTopic());
    }


    /**
     *  <p>Check if the getData method returns the Data of the Record<p>
     *
     *  @author DStack Group
     *  @return void
     */

    @Test
    public void shouldReturnDataOfTheRecord() {
        assertTrue(10 == integerRecord.getData());
        assertEquals("Ten", stringRecord.getData());
    }
}
