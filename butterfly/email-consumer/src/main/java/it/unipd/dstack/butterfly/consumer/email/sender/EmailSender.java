package it.unipd.dstack.butterfly.consumer.email.sender;

import javax.mail.MessagingException;
import javax.mail.Session;
import javax.mail.Message;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.util.Collections;
import java.util.Properties;

public class EmailSender {
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

    private Message buildMailMessage(String recipientAddress,
                                     String subject,
                                     String content) throws MessagingException {
        Message message = new MimeMessage(this.mailSession);

        InternetAddress[] fromArray = new InternetAddress[1];
        fromArray[0] = new InternetAddress("noreply-butterfly@unipd.it");
        message.addFrom(fromArray);
        message.addRecipient(Message.RecipientType.TO, new InternetAddress(recipientAddress));
        message.setSubject(subject);
        message.setContent(content, "text/html");
        return message;
    }

    /**
     * TODO: this should become asynchronous
     * @throws MessagingException
     */
    public void sendMessage(String recipientAddress,
                             String subject,
                             String content) throws MessagingException {
        Transport transport = this.mailSession.getTransport("smtp");
        transport.connect(this.server, this.email, this.password);

        var message = this.buildMailMessage(recipientAddress, subject, content);

        transport.sendMessage(message, message.getAllRecipients());
        transport.close();
    }
}
