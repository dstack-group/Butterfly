/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    email-consumer
 * @fileName:  EmailConsumerController.java
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

package it.unipd.dstack.butterfly.consumer.email;

import it.unipd.dstack.butterfly.config.AbstractConfigManager;
import it.unipd.dstack.butterfly.consumer.config.EmailConfig;
import it.unipd.dstack.butterfly.consumer.config.SMTPEmailConfig;
import it.unipd.dstack.butterfly.controller.record.Record;
import it.unipd.dstack.butterfly.consumer.avro.EventWithUserContact;
import it.unipd.dstack.butterfly.consumer.consumer.ConsumerFactory;
import it.unipd.dstack.butterfly.consumer.consumer.controller.ConsumerController;
import it.unipd.dstack.butterfly.consumer.consumer.formatstrategy.FormatStrategy;
import it.unipd.dstack.butterfly.consumer.email.message.EmailMessage;
import it.unipd.dstack.butterfly.consumer.email.sender.EmailSender;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

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
        Integer port = configManager.getIntProperty("SMTP_PORT", 587);

        EmailConfig emailConfig = new SMTPEmailConfig.Builder()
                .setHost(emailServer)
                .setUsername(emailAddress)
                .setPassword(password)
                .setPort(port)
                .setDebugEnabled(true)
                .build();

        this.emailSender = new EmailSender(emailConfig);
        this.formatStrategy = formatStrategy;

        if (!this.testEmailConnection()) {
            logger.error("Email server unreachable. Exiting");
            this.close();
        }
    }

    /**
     * Returns true if the connection with SMTP server is established correctly.
     * @return
     */
    public boolean testEmailConnection() {
        try {
            this.emailSender.testConnection();
            return true;
        } catch (Exception e) {
            logger.error(e.getMessage());
            return false;
        }
    }

    /**
     * Called when a new record is received from the broker.
     *
     * @param record
     */
    @Override
    protected void onMessageConsume(Record<EventWithUserContact> record) {
        EventWithUserContact eventWithUserContact = record.getData();

        if (logger.isInfoEnabled()) {
            logger.info("Consuming new event");
        }

        var event = eventWithUserContact.getEvent();
        String subject = String.format("[%s] %s in project %s",
                event.getService(),
                event.getEventType(),
                event.getProjectName());
        String content = this.formatStrategy.format(eventWithUserContact);
        String recipient = eventWithUserContact.getUserContact().getContactRef();

        if (logger.isInfoEnabled()) {
            logger.info(String.format("Sending email to %s", recipient));
        }

        EmailMessage emailMessage = new EmailMessage(recipient, content, subject);
        this.emailSender.sendMessage(emailMessage);
    }
}
