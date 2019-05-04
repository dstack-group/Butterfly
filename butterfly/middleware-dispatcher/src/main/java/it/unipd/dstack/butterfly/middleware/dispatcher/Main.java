/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    middleware-dispatcher
 * @fileName:  Main.java
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

package it.unipd.dstack.butterfly.middleware.dispatcher;

import it.unipd.dstack.butterfly.config.AbstractConfigManager;
import it.unipd.dstack.butterfly.config.EnvironmentConfigManager;
import it.unipd.dstack.butterfly.consumer.consumer.ConsumerImplFactory;
import it.unipd.dstack.butterfly.producer.producer.ProducerImpl;

public class Main {
    public static void main(String[] args) {
        AbstractConfigManager configManager = new EnvironmentConfigManager();
        MiddlewareDispatcherController middlewareDispatcherController =
                new MiddlewareDispatcherController(
                        configManager,
                        new ProducerImpl<>(configManager),
                        new ConsumerImplFactory<>()
                );
        middlewareDispatcherController.start();
    }
}
