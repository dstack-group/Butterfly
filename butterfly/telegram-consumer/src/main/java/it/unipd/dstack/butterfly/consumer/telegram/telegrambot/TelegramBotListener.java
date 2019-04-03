package it.unipd.dstack.butterfly.consumer.telegram.telegrambot;

import it.unipd.dstack.butterfly.consumer.telegram.message.TelegramMessage;
import it.unipd.dstack.butterfly.consumer.telegram.message.TelegramMessageSender;
import it.unipd.dstack.butterfly.consumer.telegram.response.TelegramResponse;
import it.unipd.dstack.butterfly.consumer.telegram.telegrambot.handler.CommandHandler;
import it.unipd.dstack.butterfly.consumer.telegram.telegrambot.handler.commands.Command;
import it.unipd.dstack.butterfly.consumer.telegram.telegrambot.handler.commands.CommandRegister;
import org.slf4j.Logger;
import org.telegram.telegrambots.bots.TelegramLongPollingBot;
import org.telegram.telegrambots.extensions.bots.commandbot.commands.BotCommand;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.api.objects.Message;
import org.telegram.telegrambots.meta.api.objects.Update;

import java.util.Arrays;
import java.util.List;

import static org.slf4j.LoggerFactory.getLogger;

class TelegramBotListener extends TelegramLongPollingBot {
    private static final Logger logger = getLogger(TelegramBot.class);

    private CommandHandler commandHandler;
    private final String token;
    private final String botName;
    private final CommandRegister commandRegister;

    public TelegramBotListener(String token, String botName, CommandRegister commandRegister) {
        this.token = token;
        this.botName = botName;
        this.commandRegister = commandRegister;

        this.commandHandler = new CommandHandler();
    }

     // TelegramResponse response

    private TelegramMessageSender sender = (TelegramMessage message) -> {
        SendMessage answer = new SendMessage();
        answer.setChatId(message.getRecipient());
        answer.setText(message.getContent());

        this.execute(answer);
    };

    /**
     * This method is called when receiving updates via GetUpdates method
     *
     * @param update Update received
     */
    @Override
    public void onUpdateReceived(Update update) {
        if (update.hasMessage()) {
            Message message = update.getMessage();
            if (message.isCommand() && message.hasText()) {
                String text = message.getText();
                if (text.startsWith(BotCommand.COMMAND_INIT_CHARACTER)) {
                    String commandMessage = text.substring(1);
                    String[] commandSplit = commandMessage.split(BotCommand.COMMAND_PARAMETER_SEPARATOR_REGEXP);
                    String[] parameters = Arrays.copyOfRange(commandSplit, 1, commandSplit.length);
                    List<String> paramsList = Arrays.asList(parameters);

                    String commandName = commandSplit[0];

                    Command command = this.commandRegister.getCommand(commandName);
                    if (command != null) {
                        TelegramResponse response = new TelegramResponse(message.getChatId().toString(), paramsList);
                        commandHandler.executeCommand(command, sender, response);
                        logger.info("command executed!");
                    }
                }
            }
        }
    }

    /**
     * Return bot username of this bot
     */
    @Override
    public String getBotUsername() {
        return this.botName;
    }

    /**
     * Returns the token of the bot to be able to perform Telegram Api Requests
     *
     * @return Token of the bot
     */
    @Override
    public String getBotToken() {
        return this.token;
    }
}
