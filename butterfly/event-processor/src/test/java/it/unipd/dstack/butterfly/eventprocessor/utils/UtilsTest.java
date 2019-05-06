/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    event-processor
 * @fileName:  UtilsTest.java
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

package it.unipd.dstack.butterfly.eventprocessor.utils;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

import it.unipd.dstack.butterfly.consumer.avro.UserSingleContact;
import it.unipd.dstack.butterfly.consumer.avro.Contacts;

public class UtilsTest {
    @Test
    public void canParseUserSingleContactSchema() {
        var userSingleContactBuilder = UserSingleContact.newBuilder();
        userSingleContactBuilder.setFirstname("FIRST_NAME");
        userSingleContactBuilder.setLastname("LAST_NAME");
        userSingleContactBuilder.setContact(Contacts.EMAIL);
        userSingleContactBuilder.setContactRef("firstname.lastname@email.com");
        UserSingleContact userSingleContact = userSingleContactBuilder.build();

        String userSingleContactJSON = Utils.getJSONFromAvro(userSingleContact);
        String userSingleContactJSONCompact = userSingleContactJSON.replaceAll("\\s+", "");

        String expectedUserSingleContractJSON = "{\n" +
                "  \"firstname\": \"FIRST_NAME\",\n" +
                "  \"lastname\" : \"LAST_NAME\",\n" +
                "  \"contact\": \"EMAIL\", \n" +
                "  \"contactRef\" : \"firstname.lastname@email.com\"\n" +
                "}";
        String expectedUserSingleContractJSONCompact = expectedUserSingleContractJSON.replaceAll("\\s+", "");

        assertEquals(expectedUserSingleContractJSONCompact, userSingleContactJSONCompact);
    }
}