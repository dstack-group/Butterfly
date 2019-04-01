package it.unipd.dstack.butterfly.consumer.telegram.telegrambot;

import it.unipd.dstack.butterfly.consumer.telegram.response.TelegramResponse;

import java.util.List;

@FunctionalInterface
public interface OnBotResponse {
    TelegramResponse onBotResponse(String charId, List<String> userParams);
}
