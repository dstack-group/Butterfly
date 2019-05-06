/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    middleware-dispatcher
 * @fileName:  UtilsTest.java
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 * Utils unit tests.
 */

package it.unipd.dstack.butterfly.middleware.dispatcher.utils;

import it.unipd.dstack.butterfly.consumer.avro.Contacts;
import it.unipd.dstack.butterfly.producer.avro.Event;
import it.unipd.dstack.butterfly.producer.avro.ServiceEventTypes;
import it.unipd.dstack.butterfly.producer.avro.Services;
import it.unipd.dstack.butterfly.consumer.avro.EventWithUserContact;
import it.unipd.dstack.butterfly.consumer.avro.UserSingleContact;
import it.unipd.dstack.butterfly.middleware.dispatcher.model.UserManagerResponseData;
import org.junit.jupiter.api.Test;

import java.util.Map;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Date;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class UtilsTest {
    private Event prepareEvent() {
        long time = new Date().getTime();
        Event.Builder eventBuilder = Event.newBuilder();
        eventBuilder.setTimestamp(time);
        eventBuilder.setService(Services.GITLAB);
        eventBuilder.setProjectName("PROJECT_NAME");
        eventBuilder.setProjectURL("http://project.url");
        eventBuilder.setEventId("1");
        eventBuilder.setEventType(ServiceEventTypes.GITLAB_COMMIT_CREATED);
        eventBuilder.setUsername("admin");
        eventBuilder.setUserEmail("admin@email.com");
        eventBuilder.setTitle("Some title");
        eventBuilder.setDescription("Some description");
        Event event = eventBuilder.build();

        return event;
    }

    @Test
    public void shouldProcessMessageDataList() {
        String prefix = "SOME_PREFIX_";
        Event event = this.prepareEvent();

        var userSingleContactBuilder1 = UserSingleContact.newBuilder();
        userSingleContactBuilder1.setFirstname("USER_1_FIRST_NAME");
        userSingleContactBuilder1.setLastname("USER_1_LAST_NAME");
        userSingleContactBuilder1.setContact(Contacts.TELEGRAM);
        userSingleContactBuilder1.setContactRef("1111");
        var userSingleContact1 = userSingleContactBuilder1.build();

        var userSingleContactBuilder2 = UserSingleContact.newBuilder();
        userSingleContactBuilder2.setFirstname("USER_2_FIRST_NAME");
        userSingleContactBuilder2.setLastname("USER_2_LAST_NAME");
        userSingleContactBuilder2.setContact(Contacts.SLACK);
        userSingleContactBuilder2.setContactRef("9876543210");
        var userSingleContact2 = userSingleContactBuilder2.build();

        var userSingleContactBuilder3 = UserSingleContact.newBuilder();
        userSingleContactBuilder3.setFirstname("USER_3_FIRST_NAME");
        userSingleContactBuilder3.setLastname("USER_3_LAST_NAME");
        userSingleContactBuilder3.setContact(Contacts.EMAIL);
        userSingleContactBuilder3.setContactRef("email3@email.com");
        var userSingleContact3 = userSingleContactBuilder3.build();

        var eventWithUserContactBuilder1 = EventWithUserContact.newBuilder();
        eventWithUserContactBuilder1.setEvent(event);
        eventWithUserContactBuilder1.setUserContact(userSingleContact1);
        var eventWithUserContact1 = eventWithUserContactBuilder1.build();

        var eventWithUserContactBuilder2 = EventWithUserContact.newBuilder();
        eventWithUserContactBuilder2.setEvent(event);
        eventWithUserContactBuilder2.setUserContact(userSingleContact2);
        var eventWithUserContact2 = eventWithUserContactBuilder2.build();

        var eventWithUserContactBuilder3 = EventWithUserContact.newBuilder();
        eventWithUserContactBuilder3.setEvent(event);
        eventWithUserContactBuilder3.setUserContact(userSingleContact3);
        var eventWithUserContact3 = eventWithUserContactBuilder3.build();

        List<EventWithUserContact> eventWithUserContactList =
                List.of(eventWithUserContact1, eventWithUserContact2, eventWithUserContact3);

        var producerRecordList = Utils.processMessageDataList(
                eventWithUserContactList,
                Utils.extractTopicStrategy(prefix),
                Utils::getProducerRecord
        );

        assertEquals(3, producerRecordList.size());
        assertEquals("some_prefix_telegram", producerRecordList.get(0).getTopic());
        assertEquals(eventWithUserContact1, producerRecordList.get(0).getData());
        assertEquals("some_prefix_slack", producerRecordList.get(1).getTopic());
        assertEquals(eventWithUserContact2, producerRecordList.get(1).getData());
        assertEquals("some_prefix_email", producerRecordList.get(2).getTopic());
        assertEquals(eventWithUserContact3, producerRecordList.get(2).getData());
    }

    @Test
    public void shouldParseUserManagerResponseData() {
        /**
         * Preparing data to be tested.
         */

        UserManagerResponseData responseData1 = new UserManagerResponseData();
        responseData1.setFirstname("USER_1_FIRST_NAME");
        responseData1.setLastname("USER_1_LAST_NAME");
        Map<Contacts, String> contacts1 = new LinkedHashMap<>();
        contacts1.put(Contacts.EMAIL, "email1@email.com");
        contacts1.put(Contacts.TELEGRAM, "1111");
        responseData1.setContacts(contacts1);

        UserManagerResponseData responseData2 = new UserManagerResponseData();
        responseData2.setFirstname("USER_2_FIRST_NAME");
        responseData2.setLastname("USER_2_LAST_NAME");
        Map<Contacts, String> contacts2 = new LinkedHashMap<>();
        contacts2.put(Contacts.SLACK, "9876543210");
        responseData2.setContacts(contacts2);

        UserManagerResponseData responseData3 = new UserManagerResponseData();
        responseData3.setFirstname("USER_3_FIRST_NAME");
        responseData3.setLastname("USER_3_LAST_NAME");
        Map<Contacts, String> contacts3 = new LinkedHashMap<>();
        contacts3.put(Contacts.EMAIL, "email3@email.com");
        contacts3.put(Contacts.SLACK, "0123456789");
        contacts3.put(Contacts.TELEGRAM, "3333");
        responseData3.setContacts(contacts3);

        List<UserManagerResponseData> dataList = List.of(responseData1, responseData2, responseData3);

        Event event = this.prepareEvent();

        /**
         * Preparing expectations based on the data to be tested.
         */

        var userSingleContactBuilder1 = UserSingleContact.newBuilder();
        userSingleContactBuilder1.setFirstname("USER_1_FIRST_NAME");
        userSingleContactBuilder1.setLastname("USER_1_LAST_NAME");
        userSingleContactBuilder1.setContact(Contacts.EMAIL);
        userSingleContactBuilder1.setContactRef("email1@email.com");
        var userSingleContact1 = userSingleContactBuilder1.build();

        var userSingleContactBuilder2 = UserSingleContact.newBuilder();
        userSingleContactBuilder2.setFirstname("USER_1_FIRST_NAME");
        userSingleContactBuilder2.setLastname("USER_1_LAST_NAME");
        userSingleContactBuilder2.setContact(Contacts.TELEGRAM);
        userSingleContactBuilder2.setContactRef("1111");
        var userSingleContact2 = userSingleContactBuilder2.build();

        var userSingleContactBuilder3 = UserSingleContact.newBuilder();
        userSingleContactBuilder3.setFirstname("USER_2_FIRST_NAME");
        userSingleContactBuilder3.setLastname("USER_2_LAST_NAME");
        userSingleContactBuilder3.setContact(Contacts.SLACK);
        userSingleContactBuilder3.setContactRef("9876543210");
        var userSingleContact3 = userSingleContactBuilder3.build();

        var userSingleContactBuilder4 = UserSingleContact.newBuilder();
        userSingleContactBuilder4.setFirstname("USER_3_FIRST_NAME");
        userSingleContactBuilder4.setLastname("USER_3_LAST_NAME");
        userSingleContactBuilder4.setContact(Contacts.EMAIL);
        userSingleContactBuilder4.setContactRef("email3@email.com");
        var userSingleContact4 = userSingleContactBuilder4.build();

        var userSingleContactBuilder5 = UserSingleContact.newBuilder();
        userSingleContactBuilder5.setFirstname("USER_3_FIRST_NAME");
        userSingleContactBuilder5.setLastname("USER_3_LAST_NAME");
        userSingleContactBuilder5.setContact(Contacts.SLACK);
        userSingleContactBuilder5.setContactRef("0123456789");
        var userSingleContact5 = userSingleContactBuilder5.build();

        var userSingleContactBuilder6 = UserSingleContact.newBuilder();
        userSingleContactBuilder6.setFirstname("USER_3_FIRST_NAME");
        userSingleContactBuilder6.setLastname("USER_3_LAST_NAME");
        userSingleContactBuilder6.setContact(Contacts.TELEGRAM);
        userSingleContactBuilder6.setContactRef("3333");
        var userSingleContact6 = userSingleContactBuilder6.build();

        /**
         * Preparing expected List<EventWithUserContact>.
         */

        var eventWithUserContactBuilder1 = EventWithUserContact.newBuilder();
        eventWithUserContactBuilder1.setEvent(event);
        eventWithUserContactBuilder1.setUserContact(userSingleContact1);
        var eventWithUserContact1 = eventWithUserContactBuilder1.build();

        var eventWithUserContactBuilder2 = EventWithUserContact.newBuilder();
        eventWithUserContactBuilder2.setEvent(event);
        eventWithUserContactBuilder2.setUserContact(userSingleContact2);
        var eventWithUserContact2 = eventWithUserContactBuilder2.build();

        var eventWithUserContactBuilder3 = EventWithUserContact.newBuilder();
        eventWithUserContactBuilder3.setEvent(event);
        eventWithUserContactBuilder3.setUserContact(userSingleContact3);
        var eventWithUserContact3 = eventWithUserContactBuilder3.build();

        var eventWithUserContactBuilder4 = EventWithUserContact.newBuilder();
        eventWithUserContactBuilder4.setEvent(event);
        eventWithUserContactBuilder4.setUserContact(userSingleContact4);
        var eventWithUserContact4 = eventWithUserContactBuilder4.build();

        var eventWithUserContactBuilder5 = EventWithUserContact.newBuilder();
        eventWithUserContactBuilder5.setEvent(event);
        eventWithUserContactBuilder5.setUserContact(userSingleContact5);
        var eventWithUserContact5 = eventWithUserContactBuilder5.build();

        var eventWithUserContactBuilder6 = EventWithUserContact.newBuilder();
        eventWithUserContactBuilder6.setEvent(event);
        eventWithUserContactBuilder6.setUserContact(userSingleContact6);
        var eventWithUserContact6 = eventWithUserContactBuilder6.build();

        List<EventWithUserContact> eventWithUserContactList = Utils.parseUserManagerResponseData(dataList, event);

        // there are 6 contacts in total, therefore <code>eventWithUserContactList</code> should have size() == 6
        assertEquals(6, eventWithUserContactList.size());
        assertEquals(eventWithUserContact1, eventWithUserContactList.get(0));
        assertEquals(eventWithUserContact2, eventWithUserContactList.get(1));
        assertEquals(eventWithUserContact3, eventWithUserContactList.get(2));
        assertEquals(eventWithUserContact4, eventWithUserContactList.get(3));
        assertEquals(eventWithUserContact5, eventWithUserContactList.get(4));
        assertEquals(eventWithUserContact6, eventWithUserContactList.get(5));
    }
}