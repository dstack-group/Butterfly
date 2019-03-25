package it.unipd.dstack.butterfly.consumer.email;

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
        return String.format("%s<br/>%s", event.getTitle(), event.getDescription());
    }
}
