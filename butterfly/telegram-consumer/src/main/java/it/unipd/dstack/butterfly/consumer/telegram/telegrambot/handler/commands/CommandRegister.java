/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    telegram-consumer
 * @fileName:  CommandRegister.java
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
