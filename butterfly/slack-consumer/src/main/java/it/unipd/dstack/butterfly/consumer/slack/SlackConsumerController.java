package it.unipd.dstack.butterfly.consumer.slack;

import it.unipd.dstack.butterfly.config.AbstractConfigManager;
import it.unipd.dstack.butterfly.consumer.consumer.ConsumerFactory;
import it.unipd.dstack.butterfly.consumer.consumer.controller.ConsumerController;
import it.unipd.dstack.butterfly.consumer.consumer.formatstrategy.FormatStrategy;
import it.unipd.dstack.butterfly.controller.record.Record;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class SlackConsumerController extends ConsumerController<it.unipd.dstack.butterfly.consumer.avro.EventWithUserContact> {
    private static final Logger logger = LoggerFactory.getLogger(SlackConsumerController.class);

    private final FormatStrategy<it.unipd.dstack.butterfly.consumer.avro.EventWithUserContact> formatStrategy;

    public SlackConsumerController(
            AbstractConfigManager configManager,
            ConsumerFactory<it.unipd.dstack.butterfly.consumer.avro.EventWithUserContact> consumerFactory,
            FormatStrategy<it.unipd.dstack.butterfly.consumer.avro.EventWithUserContact> formatStrategy
    ) {
        super(configManager, consumerFactory);
        this.formatStrategy = formatStrategy;
    }

    /**
     * Called when a new record is received from the broker.
     *
     * @param record
     */
    @Override
    protected void onMessageConsume(Record<it.unipd.dstack.butterfly.consumer.avro.EventWithUserContact> record) {
        it.unipd.dstack.butterfly.consumer.avro.EventWithUserContact eventWithUserContact = record.getData();

        logger.info("Consuming new event");
        var event = eventWithUserContact.getEvent();
        String subject = String.format("[%s] %s in project %s",
                event.getService(),
                event.getEventType(),
                event.getProjectName());
        String content = this.formatStrategy.format(eventWithUserContact);
        String recipient = eventWithUserContact.getUserContact().getContactRef();
        logger.info("Contact ref " + recipient);

        /*
        SlackMessage slackMessage = new SlackMessage(recipient, content, subject);
        this.slackSender.sendMessage(emailMessage);
        */
    }
}
