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
        /**
         *bold text*
         _italic text_
         [inline URL](http://www.example.com/)
         [inline mention of a user](tg://user?id=123456789)
         `inline fixed-width code`
         ```block_language
         pre-formatted fixed-width code block
         ```
         */
        var intro = String.format("Hi *%s* *%s*, here's a new event for you.",
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
