/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    email-consumer
 * @fileName:  EmailSender.java
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

package it.unipd.dstack.butterfly.consumer.email.sender;

import it.unipd.dstack.butterfly.consumer.config.EmailConfig;
import it.unipd.dstack.butterfly.consumer.consumer.message.MessageSender;
import it.unipd.dstack.butterfly.consumer.email.message.EmailMessage;
import org.simplejavamail.email.Email;
import org.simplejavamail.email.EmailBuilder;
import org.simplejavamail.mailer.Mailer;
import org.simplejavamail.mailer.MailerBuilder;
import org.simplejavamail.mailer.config.TransportStrategy;

public class EmailSender implements MessageSender<EmailMessage> {
    private final Mailer mailer;

    public EmailSender(EmailConfig emailConfig) {
        this.mailer = MailerBuilder
                .withSMTPServer(
                        emailConfig.getHost(),
                        emailConfig.getPort(),
                        emailConfig.getUsername(),
                        emailConfig.getPassword()
                )
                .withTransportStrategy(TransportStrategy.SMTP)
                .withSessionTimeout(emailConfig.getSessionTimeoutMS())
                .clearEmailAddressCriteria() // turns off email validation
                .withDebugLogging(emailConfig.isDebugEnabled())
                .buildMailer();
    }

    /**
     * TODO: it should probably be moved to MessageSender
     */
    public void testConnection() {
        this.mailer.testConnection();
    }

    /**
     * Forwards the given messaage to the appropriate service.
     *
     * @param message
     */
    @Override
    public void sendMessage(EmailMessage message) {
        Email email = EmailBuilder.startingBlank()
                .from("Butterfly Bot", "noreply-butterfly@unipd.it")
                .to(message.getRecipient())
                .withSubject(message.getSubject())
                .withHTMLText(message.getContent())
                .buildEmail();

        this.mailer.sendMail(email, true);
    }
}
