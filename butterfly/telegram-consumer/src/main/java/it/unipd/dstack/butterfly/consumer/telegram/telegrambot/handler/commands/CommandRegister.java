package it.unipd.dstack.butterfly.consumer.telegram.telegrambot.handler.commands;

public interface CommandRegister {
    /**
     * Registers a new command. Multiple command registration can be chained together.
     * @param command
     */
    CommandRegister register(Command command);

    /**
     * Removes each registered command.
     */
    void unregisterAll();

    /**
     * Returns a given command based on its name.
     * @param commandName
     * @return
     */
    Command getCommand(String commandName);
}
