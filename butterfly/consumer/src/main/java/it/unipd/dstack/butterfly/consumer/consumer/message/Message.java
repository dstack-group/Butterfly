package it.unipd.dstack.butterfly.consumer.consumer.message;

public abstract class Message {
    String recipient;
    String content;

    public Message(String recipient, String content) {
        this.recipient = recipient;
        this.content = content;
    }

    public String getRecipient() {
        return recipient;
    }

    public String getContent() {
        return content;
    }
}
