package it.unipd.dstack.butterfly.consumer.email;

import it.unipd.dstack.butterfly.config.ConfigManager;
import it.unipd.dstack.butterfly.config.record.Record;
import it.unipd.dstack.butterfly.consumer.avro.EventWithUserContact;
import it.unipd.dstack.butterfly.consumer.consumer.ConsumerFactory;
import it.unipd.dstack.butterfly.consumer.consumer.controller.ConsumerController;
import it.unipd.dstack.butterfly.consumer.email.sender.EmailSender;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.mail.MessagingException;

public class EmailConsumerController extends ConsumerController<EventWithUserContact> {
    private static final Logger logger = LoggerFactory.getLogger(EmailConsumerController.class);

    private final EmailSender emailSender;

    public EmailConsumerController(ConsumerFactory<EventWithUserContact> consumerFactory) {
        super(consumerFactory);

        String emailServer = ConfigManager.getStringProperty("EMAIL_SERVER");
        String emailAddress = ConfigManager.getStringProperty("EMAIL_ADDRESS");
        String password = ConfigManager.getStringProperty("EMAIL_PASSWORD");

        this.emailSender = new EmailSender(emailServer, emailAddress, password);
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
        String content = String.format("%s<br/>%s", event.getTitle(), event.getDescription());
        String recipient = eventWithUserContact.getUserContact().getContactRef();
        logger.info("Contact ref " + recipient);
        try {
            this.emailSender.sendMessage(recipient, subject, content);
        } catch (MessagingException e) {
            logger.error("Error sending email message " + e);
        }
    }
}
