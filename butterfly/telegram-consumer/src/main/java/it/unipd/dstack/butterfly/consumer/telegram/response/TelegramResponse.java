/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    telegram-consumer
 * @fileName:  TelegramResponse.java
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

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
