package it.unipd.dstack.butterfly.consumer.telegram;

import it.unipd.dstack.butterfly.config.AbstractConfigManager;
import it.unipd.dstack.butterfly.controller.record.Record;
import it.unipd.dstack.butterfly.consumer.avro.EventWithUserContact;
import it.unipd.dstack.butterfly.consumer.consumer.ConsumerFactory;
import it.unipd.dstack.butterfly.consumer.consumer.controller.ConsumerController;
import it.unipd.dstack.butterfly.consumer.consumer.formatstrategy.FormatStrategy;
import it.unipd.dstack.butterfly.consumer.telegram.message.TelegramMessage;
import it.unipd.dstack.butterfly.consumer.telegram.telegrambot.TelegramBot;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class TelegramConsumerController extends ConsumerController<EventWithUserContact> {

    private static final Logger logger = LoggerFactory.getLogger(TelegramConsumerController.class);

    /**
     * TODO: this should become an Adapter
     */
    private final TelegramBot bot;
    private final FormatStrategy<EventWithUserContact> formatStrategy;

    public TelegramConsumerController(AbstractConfigManager configManager,
                                      ConsumerFactory<EventWithUserContact> consumerFactory,
                                      TelegramBot bot,
                                      FormatStrategy<EventWithUserContact> formatStrategy) {
        super(configManager, consumerFactory);
        this.bot = bot;
        this.formatStrategy = formatStrategy;
    }

    /**
     * Called when a new record is received from the broker.
     *
     * @param record
     */
    @Override
    protected void onMessageConsume(Record<EventWithUserContact> record) {
        EventWithUserContact eventWithUserContact = record.getData();
        String message = this.formatStrategy.format(eventWithUserContact);
        String contactRef = eventWithUserContact.getUserContact().getContactRef();
        Long chatId = Long.valueOf(contactRef);

        TelegramMessage telegramMessage = new TelegramMessage(contactRef, message);
        this.bot.sendMessage(telegramMessage);
    }

    /**
     * Releases TelegramConsumerController's resources
     */
    @Override
    protected void releaseResources() {
        this.bot.close();
    }
}
