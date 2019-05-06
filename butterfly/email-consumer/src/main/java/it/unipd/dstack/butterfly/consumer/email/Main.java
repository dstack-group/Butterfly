/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    email-consumer
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

package it.unipd.dstack.butterfly.consumer.email;

import it.unipd.dstack.butterfly.config.AbstractConfigManager;
import it.unipd.dstack.butterfly.config.EnvironmentConfigManager;
import it.unipd.dstack.butterfly.consumer.consumer.ConsumerImplFactory;
import it.unipd.dstack.butterfly.consumer.email.formatstrategy.EmailFormatStrategy;

public class Main {
    public static void main(String[] args) {
        AbstractConfigManager configManager = new EnvironmentConfigManager();

        EmailFormatStrategy emailFormatStrategy = new EmailFormatStrategy();
        EmailConsumerController emailConsumerController =
                new EmailConsumerController(configManager, new ConsumerImplFactory<>(), emailFormatStrategy);
        emailConsumerController.start();
    }
}
