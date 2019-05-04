/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    controller
 * @fileName:  Controller.java
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 * Controller defines the common interface that consumer-oriented controllers and producer-oriented controllers
 * should implement.
 */

package it.unipd.dstack.butterfly.controller;

public interface Controller {
    /**
     * Spins up the controller.
     */
    void start();

    /**
     * Closes the controller and releases resources.
     */
    void close();

    /**
     * Graceful shutdown
     */
    default void gracefulShutdown() {
        Thread shutdownThread = new Thread(this::close);
        Runtime.getRuntime()
                .addShutdownHook(shutdownThread);
    }
}