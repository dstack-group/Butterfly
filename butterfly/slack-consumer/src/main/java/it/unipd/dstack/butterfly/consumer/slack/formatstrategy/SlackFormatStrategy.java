/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    slack-consumer
 * @fileName:  SlackFormatStrategy.java
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

package it.unipd.dstack.butterfly.consumer.slack.formatstrategy;
import it.unipd.dstack.butterfly.producer.avro.Event;
import it.unipd.dstack.butterfly.consumer.avro.EventWithUserContact;
import it.unipd.dstack.butterfly.consumer.consumer.formatstrategy.FormatStrategy;

public class SlackFormatStrategy implements FormatStrategy<EventWithUserContact> {
    /**
     * Returns the appropriate formatted message from an input event object.
     *
     * @param eventWithUserContact
     * @return
     */
    @Override
    public String format(EventWithUserContact eventWithUserContact) {
        Event event = eventWithUserContact.getEvent();

        var intro = String.format("Hi *%s* *%s*, here's a new event for you.\n",
                eventWithUserContact.getUserContact().getFirstname(),
                eventWithUserContact.getUserContact().getLastname());
        var header = String.format("Progetto: [%s](%s)",
                event.getProjectName(),
                event.getProjectURL());
        var title = String.format("*%s*", event.getTitle());
        var description = String.format("%s", event.getDescription());

        return String.format("%s\n%s\n%s\n%s", intro, header, title, description);
    }
}