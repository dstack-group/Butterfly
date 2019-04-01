package it.unipd.dstack.butterfly.consumer.telegram.response;

import java.util.List;

public class TelegramResponse {
    private final String chatId;
    private final List<String> commandArguments;

    public TelegramResponse(String chatId, List<String> commandArguments) {
        this.chatId = chatId;
        this.commandArguments = commandArguments;
    }

    public String getChatId() {
        return chatId;
    }

    public List<String> getCommandArguments() {
        return commandArguments;
    }
}
