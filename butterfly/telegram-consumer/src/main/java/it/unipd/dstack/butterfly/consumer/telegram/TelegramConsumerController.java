package it.unipd.dstack.butterfly.consumer.telegram;

import it.unipd.dstack.butterfly.config.ConfigManager;
import it.unipd.dstack.butterfly.config.record.Record;
import it.unipd.dstack.butterfly.consumer.avro.EventWithUserContact;
import it.unipd.dstack.butterfly.consumer.consumer.ConsumerImpl;
import it.unipd.dstack.butterfly.consumer.telegram.telegrambot.TelegramBot;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.telegram.telegrambots.meta.TelegramBotsApi;
import org.telegram.telegrambots.meta.exceptions.TelegramApiRequestException;

public class TelegramConsumerController {

    private static final Logger logger = LoggerFactory.getLogger(TelegramConsumerController.class);
    private final String kafkaTopic;
    private TelegramBot bot;
    private ConsumerImpl<EventWithUserContact> consumer;

    public TelegramConsumerController() {
        this.kafkaTopic = ConfigManager.getStringProperty("KAFKA_TOPIC");
        logger.info(kafkaTopic);
        this.consumer = new ConsumerImpl<>(this::onMessageConsume);

        bot = new TelegramBot();
        TelegramBotsApi botsApi = new TelegramBotsApi();
        try {
            botsApi.registerBot(bot);
        } catch (TelegramApiRequestException e) {
            logger.error("TELEGRAM CONSUMER bot error", e.toString());
        }
    }

    public void start() {
        logger.info("*** TelegramConsumer started...");
        this.consumer.start();
    }

    private void onMessageConsume(Record<EventWithUserContact> record) {
        EventWithUserContact eventWithUserContact = record.getData();
        Pair values = getMessageFromEvent(eventWithUserContact);
        logger.info("TelegramConsumer message: " + values.msg);
        bot.sendMessage(values.id, values.msg);
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

    // stops the consumer
    public void close() {
        this.consumer.close();
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
