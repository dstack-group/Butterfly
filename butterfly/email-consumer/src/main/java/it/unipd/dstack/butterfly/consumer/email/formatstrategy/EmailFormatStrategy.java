/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    email-consumer
 * @fileName:  EmailFormatStrategy.java
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

package it.unipd.dstack.butterfly.consumer.email.formatstrategy;

import it.unipd.dstack.butterfly.consumer.avro.EventWithUserContact;
import it.unipd.dstack.butterfly.consumer.consumer.formatstrategy.FormatStrategy;

public class EmailFormatStrategy implements FormatStrategy<EventWithUserContact> {
    /**
     * Returns the appropriate formatted message from an input event object.
     *
     * @param eventWithUserContact
     * @return
     */
    @Override
    public String format(EventWithUserContact eventWithUserContact) {
        var event = eventWithUserContact.getEvent();

        var intro = String.format("Hi %s %s, here's a new event for you.<br/><br/>",
                eventWithUserContact.getUserContact().getFirstname(),
                eventWithUserContact.getUserContact().getLastname());
        var content = String.format("%s<br/>%s", event.getTitle(), event.getDescription());

        return String.format("%s %s", intro, content);
    }
}
