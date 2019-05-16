/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    telegram-consumer
 * @fileName:  TelegramFormatStrategy.java
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

package it.unipd.dstack.butterfly.consumer.telegram.formatstrategy;

import it.unipd.dstack.butterfly.consumer.avro.EventWithUserContact;
import it.unipd.dstack.butterfly.consumer.consumer.formatstrategy.FormatStrategy;

import java.it.unipd.dstack.butterfly.avro.ServiceEventTypesTranslation;

public class TelegramFormatStrategy implements FormatStrategy<EventWithUserContact> {
    /**
     * Returns the appropriate formatted message from an input event object.
     *
     * @param eventWithUserContact the input event object
     * @return
     */
    @Override
    public String format(EventWithUserContact eventWithUserContact) {
        var event = eventWithUserContact.getEvent();

        var intro = String.format("Hi *%s* *%s*, here's a new event for you.\n",
                eventWithUserContact.getUserContact().getFirstname(),
                eventWithUserContact.getUserContact().getLastname());
        var eventString = String.format("Event: %s", ServiceEventTypesTranslation.translate(event.getEventType()));
        var header = String.format("Project: [%s](%s)",
                event.getProjectName(),
                event.getProjectURL());
        var title = String.format("*%s*", event.getTitle());
        var description = String.format("%s", event.getDescription());

        return String.format("%s\n%s\n%s\n%s\n%s", intro, eventString, header, title, description);
    }
}
