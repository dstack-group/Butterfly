package it.unipd.dstack.butterfly.consumer.email.message;

import it.unipd.dstack.butterfly.consumer.consumer.message.Message;

public class EmailMessage extends Message {
    private String subject;

    public EmailMessage(String recipient, String content, String subject) {
        super(recipient, content);
        this.subject = subject;
    }

    public String getSubject() {
        return subject;
    }
}
