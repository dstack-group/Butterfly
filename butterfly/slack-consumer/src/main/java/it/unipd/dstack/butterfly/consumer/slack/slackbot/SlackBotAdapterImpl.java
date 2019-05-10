/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    slack-consumer
 * @fileName:  SlackBotAdapterImpl.java
 * @created:   2019-05-03
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

package it.unipd.dstack.butterfly.consumer.slack.slackbot;

import com.ullink.slack.simpleslackapi.SlackUser;
import it.unipd.dstack.butterfly.consumer.slack.message.SlackMessage;
import org.slf4j.Logger;
import com.ullink.slack.simpleslackapi.SlackChannel;
import com.ullink.slack.simpleslackapi.SlackSession;
import com.ullink.slack.simpleslackapi.impl.SlackSessionFactory;
import org.slf4j.LoggerFactory;

public class SlackBotAdapterImpl implements SlackBot {
    private static final Logger logger = LoggerFactory.getLogger(SlackBotAdapterImpl.class);

    private final SlackSession session;

    public SlackBotAdapterImpl(String token) {
        this.session = SlackSessionFactory.createWebSocketSlackSession(token);
    }

    @Override
    public boolean testSlackConnection() {
        try {
            session.connect();
            return true;
        } catch (Exception e) {
            logger.error(String.format("SLACK CONSUMER bot error %s", e));
            return false;
        }
    }

    /**
     * Sends message to Slack
     *
     * @param message the message to send
     */
    @Override
    public void sendMessage(SlackMessage message) {
        SlackUser user = session.findUserById(message.getRecipient());
        try {
            if (logger.isInfoEnabled()) {
                logger.info(String.format("SENDING TO %s", message.getRecipient()));
                logger.info(String.format("CONTENT %s", message.getContent()));
            }
            session.sendMessageToUser(user, message.getContent(), null);
        } catch (Exception e) {
            logger.error(String.format("SLACK_SEND_EXCEPTION %s", e));
        }
    }

    /**
     * Releases Slack Bot resources.
     */
    @Override
    public void close() {
        try {
            session.disconnect();
        } catch (Exception e) {
            logger.error("Error while closing slack bot");
        }
    }
}
