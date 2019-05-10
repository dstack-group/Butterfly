/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    slack-consumer
 * @fileName:  SlackConsumerController.java
 * @created:   2019-05-03
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
import it.unipd.dstack.butterfly.controller.record.Record;
import it.unipd.dstack.butterfly.consumer.avro.EventWithUserContact;
import it.unipd.dstack.butterfly.consumer.consumer.ConsumerFactory;
import it.unipd.dstack.butterfly.consumer.consumer.controller.ConsumerController;
import it.unipd.dstack.butterfly.consumer.consumer.formatstrategy.FormatStrategy;
import it.unipd.dstack.butterfly.consumer.slack.message.SlackMessage;
import it.unipd.dstack.butterfly.consumer.slack.slackbot.SlackBot;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class SlackConsumerController extends ConsumerController<EventWithUserContact> {
    private static Logger logger = LoggerFactory.getLogger(SlackConsumerController.class);

    private final SlackBot bot;
    private final FormatStrategy<EventWithUserContact> formatStrategy;

    public SlackConsumerController(AbstractConfigManager configManager,
                                   ConsumerFactory<EventWithUserContact> consumerFactory,
                                   SlackBot bot,
                                   FormatStrategy<EventWithUserContact> formatStrategy) {
        super(configManager, consumerFactory);
        this.bot = bot;
        this.formatStrategy = formatStrategy;

        if (!this.bot.testSlackConnection()) {
            this.logger.error("Cannot connect to Slack, closing.");
            this.close();
        }
    }

    /**
     * Called when a new record is received from the broker.
     *
     * @param record
     */
    @Override
    protected void onMessageConsume(Record<EventWithUserContact> record) {
        EventWithUserContact eventWithUserContact = record.getData();
        String message = this.formatStrategy.format(eventWithUserContact);
        String contactRef = eventWithUserContact.getUserContact().getContactRef();

        SlackMessage slackMessage = new SlackMessage(contactRef, message);
        this.bot.sendMessage(slackMessage);
    }

    /**
     * Releases SlackConsumerController's resources
     */
    @Override
    protected void releaseResources() {
        this.bot.close();
    }
}
