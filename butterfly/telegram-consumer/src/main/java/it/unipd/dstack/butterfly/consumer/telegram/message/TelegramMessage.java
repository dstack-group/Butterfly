package it.unipd.dstack.butterfly.consumer.telegram.message;

import it.unipd.dstack.butterfly.consumer.consumer.message.Message;

public class TelegramMessage extends Message {
    public TelegramMessage(String contactRef, String content) {
        super(contactRef, content);
    }
}
