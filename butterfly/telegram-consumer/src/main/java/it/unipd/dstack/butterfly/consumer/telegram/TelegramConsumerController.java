package it.unipd.dstack.butterfly.consumer.telegram;

import it.unipd.dstack.butterfly.config.record.Record;
import it.unipd.dstack.butterfly.consumer.avro.EventWithUserContact;
import it.unipd.dstack.butterfly.consumer.consumer.ConsumerFactory;
import it.unipd.dstack.butterfly.consumer.consumer.controller.ConsumerController;
import it.unipd.dstack.butterfly.consumer.telegram.telegrambot.TelegramBot;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.telegram.telegrambots.meta.exceptions.TelegramApiRequestException;

public class TelegramConsumerController extends ConsumerController<EventWithUserContact> {

    private static final Logger logger = LoggerFactory.getLogger(TelegramConsumerController.class);

    /**
     * TODO: this should become an Adapter
     */
    private final TelegramBot bot;

    public TelegramConsumerController(ConsumerFactory<EventWithUserContact> consumerFactory, TelegramBot bot) {
        super(consumerFactory);
        this.bot = bot;
    }

    private Pair getMessageFromEvent(EventWithUserContact eventWithUserContact) {
        var event = eventWithUserContact.getEvent();
        var title = event.getTitle();
        var url = event.getProjectName();
        var description = event.getDescription();
        // long id = Long.parseLong(event.getUserId().toString());
        long id = 50736039;

        return new Pair(id, String.format("**[{0}](http://{1})**: {2}", title, url, description));
    }

    /**
     * Called when a new record is received from the broker.
     *
     * @param record
     */
    @Override
    protected void onMessageConsume(Record<EventWithUserContact> record) {
        EventWithUserContact eventWithUserContact = record.getData();
        Pair values = getMessageFromEvent(eventWithUserContact);
        logger.info("TelegramConsumer message: " + values.msg);
        bot.sendMessage(values.id, values.msg);
    }

    /**
     * Releases TelegramConsumerController's resources
     */
    @Override
    protected void releaseResources() {
        try {
            this.bot.clearWebhook();
        } catch (TelegramApiRequestException e) {
            logger.error("Error releasing Telegram bot: " + e.getStackTrace());
        }
    }

    public class Pair {
        public final long id;
        public final String msg;

        public Pair(long id, String msg) {
            this.id = id;
            this.msg = msg;
        }

    }
}
