package it.unipd.dstack.butterfly.consumer.telegram;

import it.unipd.dstack.butterfly.common.config.ConfigManager;
import it.unipd.dstack.butterfly.common.record.Record;
import it.unipd.dstack.butterfly.consumer.avro.EventWithUserContact;
import it.unipd.dstack.butterfly.consumer.consumer.ConsumerFactory;
import it.unipd.dstack.butterfly.consumer.consumer.controller.ConsumerController;
import it.unipd.dstack.butterfly.consumer.consumer.formatstrategy.FormatStrategy;
import it.unipd.dstack.butterfly.consumer.telegram.message.TelegramMessage;
import it.unipd.dstack.butterfly.consumer.telegram.telegrambot.TelegramBot;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;
import org.telegram.telegrambots.meta.exceptions.TelegramApiRequestException;

public class TelegramConsumerController extends ConsumerController<EventWithUserContact> {

    private static final Logger logger = LoggerFactory.getLogger(TelegramConsumerController.class);

    /**
     * TODO: this should become an Adapter
     */
    private final TelegramBot bot;
    private final FormatStrategy<EventWithUserContact> formatStrategy;

    public TelegramConsumerController(ConfigManager configManager,
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

        // TODO: retrieve from "eventWithUserContact.getUserContact().getContactRef()"
        Long id = Long.valueOf(50736039);

        logger.info("TelegramConsumer message: " + message);

        TelegramMessage telegramMessage = new TelegramMessage(id.toString(), message);
        try {
            bot.sendMessage(telegramMessage);
        } catch (TelegramApiException e) {
            logger.error(String.format("Could not sendMessage message with chat_id={0} and content={1} "),
                    telegramMessage.getRecipient(),
                    telegramMessage.getContent());
            logger.error(e.getMessage());
        }
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
}
