/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    telegram-consumer
 * @fileName:  CommandRegisterImpl.java
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

package it.unipd.dstack.butterfly.consumer.telegram.telegrambot.handler.commands;

import java.util.HashMap;
import java.util.Map;

public class CommandRegisterImpl implements CommandRegister {
    private Map<String, Command> commandMap = new HashMap<>();

    /**
     * Registers a new command.
     *
     * @param command
     */
    @Override
    public CommandRegister register(Command command) {
        if (!this.commandMap.containsKey(command.getCommandName())) {
            this.commandMap.put(command.getCommandName(), command);
        }
        return this;
    }

    /**
     * Removes each registered command.
     */
    @Override
    public void unregisterAll() {
        this.commandMap.clear();
    }

    /**
     * Returns a given command based on its name.
     *
     * @param commandName
     */
    @Override
    public Command getCommand(String commandName) {
        return this.commandMap.get(commandName);
    }
}
