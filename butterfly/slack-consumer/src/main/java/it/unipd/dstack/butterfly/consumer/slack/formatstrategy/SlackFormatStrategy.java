package it.unipd.dstack.butterfly.consumer.slack.formatstrategy;

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
        var event = eventWithUserContact.getEvent();

        var intro = String.format("Hi %s %s, here's a new event for you.<br/><br/>",
                eventWithUserContact.getUserContact().getFirstname(),
                eventWithUserContact.getUserContact().getLastname());
        var content = String.format("%s<br/>%s", event.getTitle(), event.getDescription());

        return String.format("%s %s", intro, content);
    }
}