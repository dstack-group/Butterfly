/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    telegram-consumer
 * @fileName:  OnBotResponse.java
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

package it.unipd.dstack.butterfly.consumer.telegram.telegrambot;

import it.unipd.dstack.butterfly.consumer.telegram.response.TelegramResponse;

import java.util.List;

@FunctionalInterface
public interface OnBotResponse {
    TelegramResponse onBotResponse(String charId, List<String> userParams);
}
