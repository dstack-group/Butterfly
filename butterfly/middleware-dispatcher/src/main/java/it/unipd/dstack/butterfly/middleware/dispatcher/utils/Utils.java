/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    middleware-dispatcher
 * @fileName:  Utils.java
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

package it.unipd.dstack.butterfly.middleware.dispatcher.utils;

import it.unipd.dstack.butterfly.consumer.avro.EventWithUserContact;
import it.unipd.dstack.butterfly.consumer.avro.UserSingleContact;
import it.unipd.dstack.butterfly.consumer.utils.ConsumerUtils;
import it.unipd.dstack.butterfly.middleware.dispatcher.model.UserManagerResponseData;
import it.unipd.dstack.butterfly.producer.avro.Event;
import it.unipd.dstack.butterfly.controller.record.Record;
import org.apache.avro.specific.SpecificRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.function.BiFunction;
import java.util.function.Function;
import java.util.stream.Collectors;

public final class Utils {
    private static final Logger logger = LoggerFactory.getLogger(Utils.class);

    private Utils() {}

    public static List<EventWithUserContact> parseUserManagerResponseData(
            List<UserManagerResponseData> data,
            Event event
    ) {
        return data.stream()
                .flatMap(user -> {
                    var userSingleContactListStream = user.getContacts().
                            entrySet()
                            .stream()
                            .map(contactInfoEntry -> {
                                logger.info("Trying to build UserSingleContact");
                                var userSingleContactBuilder = UserSingleContact.newBuilder();
                                userSingleContactBuilder.setFirstname(user.getFirstname());
                                userSingleContactBuilder.setLastname(user.getLastname());
                                userSingleContactBuilder.setContact(contactInfoEntry.getKey());
                                userSingleContactBuilder.setContactRef(contactInfoEntry.getValue());
                                return userSingleContactBuilder.build();
                            });

                    logger.info(String.format("userSingleContactListStream: %s", userSingleContactListStream));

                    return userSingleContactListStream
                            .map(userSingleContact -> {
                                logger.info("Trying to build EventWithUserContact");
                                var eventWithUserContactBuilder = EventWithUserContact.newBuilder();
                                eventWithUserContactBuilder.setEvent(event);
                                eventWithUserContactBuilder.setUserContact(userSingleContact);
                                return eventWithUserContactBuilder.build();
                            });
                }).collect(Collectors.toList());
    }

    /**
     * Returns a function that, given a topic and an Avro record, returns a ProducerRecord.
     *
     * @param topic
     * @param avroRecord
     * @param <T> the type of avroRecord
     * @return
     */
    public static <T extends SpecificRecord> Record<T> getProducerRecord(String topic, T avroRecord) {
        return new Record<>(topic, avroRecord);
    }

    /**
     * Returns the destination topic from eventWithUserContact's contact platform.
     *
     * @param eventWithUserContact
     * @return the destination topic
     */

    /**
     * Returns the destination topic from eventWithUserContact's contact platform using a prefix.
     * @param messageTopicPrefix
     * @return a lowercase concatenation of the topic prefix and the actual contact type of the given event with
     * user contact info attached.
     */
    public static Function<EventWithUserContact, String> extractTopicStrategy(String messageTopicPrefix) {
        return (EventWithUserContact eventWithUserContact) ->
            ConsumerUtils.getLowerCaseTopicFromEnum(messageTopicPrefix,
                    eventWithUserContact.getUserContact().getContact());
    }

    /**
     * Builds a list of objects returned by resultFactory for each item in messageDataList, which, upon applying
     * topicFactory to them, should return the correct topic for each item.
     *
     * @param messageDataList List of items to sendMessage from which topicFactory is able to gather the proper topic
     * @param topicFactory    Function that, given the data to be sent, returns the proper topic
     * @param resultFactory   Function that, given the topic chose by topicFactory and the data to be sent, returns
     *                        an object of type V
     * @param <T>             The type of the messages to be sent
     * @param <V>             The type of the object generated by resultFactory
     * @return A list of objects generated by resultFactory, according to the topics generated by topicFactory
     * and the message data obtained by messageDataList
     */
    public static <T, V> List<T> processMessageDataList(
            List<V> messageDataList,
            Function<? super V, String> topicFactory,
            BiFunction<String, V, T> resultFactory
    ) {
        return messageDataList
                .stream()
                .map(messageData -> {
                    String topic = topicFactory.apply(messageData);
                    return resultFactory.apply(topic, messageData);
                })
                .collect(Collectors.toList());
    }
}
