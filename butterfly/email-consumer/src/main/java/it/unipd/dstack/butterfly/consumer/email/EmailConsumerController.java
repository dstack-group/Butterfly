package it.unipd.dstack.butterfly.consumer.email;

import it.unipd.dstack.butterfly.config.AbstractConfigManager;
import it.unipd.dstack.butterfly.controller.record.Record;
import it.unipd.dstack.butterfly.consumer.avro.EventWithUserContact;
import it.unipd.dstack.butterfly.consumer.consumer.ConsumerFactory;
import it.unipd.dstack.butterfly.consumer.consumer.controller.ConsumerController;
import it.unipd.dstack.butterfly.consumer.consumer.formatstrategy.FormatStrategy;
import it.unipd.dstack.butterfly.consumer.email.message.EmailMessage;
import it.unipd.dstack.butterfly.consumer.email.sender.EmailSender;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.mail.MessagingException;

public class EmailConsumerController extends ConsumerController<EventWithUserContact> {
    private static final Logger logger = LoggerFactory.getLogger(EmailConsumerController.class);

    private final EmailSender emailSender;
    private final FormatStrategy<EventWithUserContact> formatStrategy;

    public EmailConsumerController(
            AbstractConfigManager configManager,
            ConsumerFactory<EventWithUserContact> consumerFactory,
           FormatStrategy<EventWithUserContact> formatStrategy
    ) {
        super(configManager, consumerFactory);

        String emailServer = configManager.getStringProperty("EMAIL_SERVER");
        String emailAddress = configManager.getStringProperty("EMAIL_ADDRESS");
        String password = configManager.getStringProperty("EMAIL_PASSWORD");

        this.emailSender = new EmailSender(emailServer, emailAddress, password);
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

        logger.info("Consuming new event");
        var event = eventWithUserContact.getEvent();
        String subject = String.format("[%s] %s in project %s",
                event.getService(),
                event.getEventType(),
                event.getProjectName());
        String content = this.formatStrategy.format(eventWithUserContact);
        String recipient = eventWithUserContact.getUserContact().getContactRef();
        logger.info("Contact ref " + recipient);

        EmailMessage emailMessage = new EmailMessage(recipient, content, subject);

        try {
            this.emailSender.sendMessage(emailMessage);
        } catch (MessagingException e) {
            logger.error("Error sending email message " + e);
        }
    }
}
