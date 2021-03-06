/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    controller
 * @fileName:  RecordTest.java
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 * Unit tests for Record.
 */

package it.unipd.dstack.butterfly.controller.record;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class RecordTest {

    private Record<Integer> integerRecord = new Record<>("IntegerTest", 10);
    private Record<String> stringRecord = new Record<>("StringTest", "Ten");

    /**
     * <p>Check if the getTopic method returns the Topic string of the Record<p>
     *
     * @author DStack Group
     * @return void
     */

    @Test
    public void shouldReturnTopicOfTheRecord() {
        assertEquals("IntegerTest", integerRecord.getTopic());
        assertEquals("StringTest", stringRecord.getTopic());
    }


    /**
     * <p>Check if the getData method returns the Data of the Record<p>
     *
     * @author DStack Group
     * @return void
     */

    @Test
    public void shouldReturnDataOfTheRecord() {
        assertTrue(10 == integerRecord.getData());
        assertEquals("Ten", stringRecord.getData());
    }
}
