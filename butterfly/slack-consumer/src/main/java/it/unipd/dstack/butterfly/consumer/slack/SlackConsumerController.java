/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    slack-consumer
 * @fileName:  SlackConsumerController.java
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

package it.unipd.dstack.butterfly.consumer.slack;

import it.unipd.dstack.butterfly.config.AbstractConfigManager;
import it.unipd.dstack.butterfly.consumer.consumer.ConsumerFactory;
import it.unipd.dstack.butterfly.consumer.consumer.controller.ConsumerController;
import it.unipd.dstack.butterfly.consumer.consumer.formatstrategy.FormatStrategy;
import it.unipd.dstack.butterfly.controller.record.Record;
import it.unipd.dstack.butterfly.consumer.avro.EventWithUserContact;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class SlackConsumerController extends ConsumerController<EventWithUserContact> {
    private static final Logger logger = LoggerFactory.getLogger(SlackConsumerController.class);

    private final FormatStrategy<EventWithUserContact> formatStrategy;

    public SlackConsumerController(
            AbstractConfigManager configManager,
            ConsumerFactory<EventWithUserContact> consumerFactory,
            FormatStrategy<EventWithUserContact> formatStrategy
    ) {
        super(configManager, consumerFactory);
        this.formatStrategy = formatStrategy;
    }

    /**
     * Called when a new record is received from the broker.
     *
     * @param record
     */
    @Override
    protected void onMessageConsume(Record<EventWithUserContact> record) {
        EventWithUserContact eventWithUserContact = record.getData();

        logger.info("Consuming new event");
        var event = eventWithUserContact.getEvent();
        String subject = String.format("[%s] %s in project %s",
                event.getService(),
                event.getEventType(),
                event.getProjectName());
        String content = this.formatStrategy.format(eventWithUserContact);
        String recipient = eventWithUserContact.getUserContact().getContactRef();
        logger.info("Contact ref " + recipient);

        /*
        SlackMessage slackMessage = new SlackMessage(recipient, content, subject);
        this.slackSender.sendMessage(emailMessage);
        */
    }
}
