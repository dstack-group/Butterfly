package it.unipd.dstack.butterfly.consumer.telegram;

import it.unipd.dstack.butterfly.config.ConfigManager;
import it.unipd.dstack.butterfly.consumer.ConsumerController;
import it.unipd.dstack.butterfly.consumer.avro.EventWithUserContact;
import it.unipd.dstack.butterfly.consumer.telegram.telegrambot.TelegramBot;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.telegram.telegrambots.meta.TelegramBotsApi;
import org.telegram.telegrambots.meta.exceptions.TelegramApiRequestException;

public class TelegramConsumerController {

    private static final Logger logger = LoggerFactory.getLogger(TelegramConsumerController.class);
    private final String kafkaTopic;
    private TelegramBot bot;
    private ConsumerController<String, EventWithUserContact> consumerController;

    public TelegramConsumerController() {
        this.kafkaTopic = ConfigManager.getStringProperty("KAFKA_TOPIC");
        logger.info(kafkaTopic);
        this.consumerController = new ConsumerController<>(this.kafkaTopic);
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
        // TODO id must be obtained from the message
        long id = 50736039;
        try {
            this.consumerController.start(this::onMessageConsume);
        } catch (Exception e) {
            logger.error("Exception while consuming: " + e);
        }
    }

    private void onMessageConsume(EventWithUserContact eventWithUserContact) {
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

    //stops the consumer
    public void stop() {
        this.consumerController.stop();
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
