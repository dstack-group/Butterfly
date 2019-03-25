package it.unipd.dstack.butterfly.consumer.email.sender;

import it.unipd.dstack.butterfly.consumer.consumer.message.MessageSender;
import it.unipd.dstack.butterfly.consumer.email.message.EmailMessage;

import javax.mail.*;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.util.Properties;

public class EmailSender implements MessageSender<EmailMessage> {
    private final Properties mailServerProperties;
    private final String server;
    private final String email;
    private final String password;
    private Session mailSession;

    public EmailSender(String server, String email, String password) {
        this.server = server;
        this.email = email;
        this.password = password;
        
        this.mailServerProperties = System.getProperties();
        mailServerProperties.put("mail.smtp.port", "587");
        mailServerProperties.put("mail.smtp.auth", true);
        mailServerProperties.put("mail.smtp.starttls.enable", "true");

        this.mailSession = Session.getDefaultInstance(mailServerProperties, null);
    }

    private Message buildEmailMessage(EmailMessage emailMessage) throws MessagingException {
        Message message = new MimeMessage(this.mailSession);

        InternetAddress[] fromArray = new InternetAddress[1];
        fromArray[0] = new InternetAddress("noreply-butterfly@unipd.it");
        message.addFrom(fromArray);
        message.addRecipient(Message.RecipientType.TO, new InternetAddress(emailMessage.getRecipient()));
        message.setSubject(emailMessage.getSubject());
        message.setContent(emailMessage.getContent(), "text/html");
        return message;
    }

    /**
     * Forwards the given messaage to the appropriate service.
     *
     * @param message
     */
    @Override
    public void sendMessage(EmailMessage message) throws MessagingException {
        Transport transport = null;
        try {
            transport = this.mailSession.getTransport("smtp");
        } catch (NoSuchProviderException e) {
            e.printStackTrace();
        }
        transport.connect(this.server, this.email, this.password);
        var mailMessage = this.buildEmailMessage(message);
        transport.sendMessage(mailMessage, mailMessage.getAllRecipients());
        transport.close();
    }
}
