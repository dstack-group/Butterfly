package it.unipd.dstack.butterfly.consumer.telegram.formatstrategy;

import it.unipd.dstack.butterfly.consumer.avro.EventWithUserContact;
import it.unipd.dstack.butterfly.consumer.consumer.formatstrategy.FormatStrategy;

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
        var title = event.getTitle();
        var url = event.getProjectName();
        var description = event.getDescription();

        return String.format("**[{0}](http://{1})**: {2}", title, url, description);
    }
}
