package it.unipd.dstack.butterfly.consumer.email;

import it.unipd.dstack.butterfly.config.ConfigManager;
import it.unipd.dstack.butterfly.config.record.Record;
import it.unipd.dstack.butterfly.consumer.ConsumerController;
import it.unipd.dstack.butterfly.consumer.avro.EventWithUserContact;
import it.unipd.dstack.butterfly.consumer.consumer.ConsumerImpl;
import it.unipd.dstack.butterfly.consumer.email.sender.EmailSender;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.mail.MessagingException;

public class EmailConsumerController {
    private static final Logger logger = LoggerFactory.getLogger(EmailConsumerController.class);

    private final ConsumerImpl<EventWithUserContact> consumer;
    private final String serviceName;
    private final String kafkaTopic;
    private EmailSender emailSender;

    public EmailConsumerController() {
        this.serviceName = ConfigManager.getStringProperty("SERVICE_NAME", "EmailConsumer");
        this.kafkaTopic = ConfigManager.getStringProperty("KAFKA_TOPIC");

        String emailServer = ConfigManager.getStringProperty("EMAIL_SERVER");
        String emailAddress = ConfigManager.getStringProperty("EMAIL_ADDRESS");
        String password = ConfigManager.getStringProperty("EMAIL_PASSWORD");

        this.consumer = new ConsumerImpl<>(this::onMessageConsume);
        this.consumer.subscribe(this.kafkaTopic);
        this.emailSender = new EmailSender(emailServer, emailAddress, password);
    }

    public void start() {
        logger.info(this.serviceName + " started");
        this.consumer.start();
    }

    public void close() {
        this.consumer.close();
    }

    private void onMessageConsume(Record<EventWithUserContact> record) {
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
