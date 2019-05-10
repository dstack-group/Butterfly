/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    slack-consumer
 * @fileName:  SlackBot.java
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


import it.unipd.dstack.butterfly.consumer.slack.message.SlackMessage;

public interface SlackBot {
    /**
     * Sends message to Slack
     * @param message the message to send
     */
    void sendMessage(SlackMessage message);

    /**
     * Releases Slack Bot resources.
     */
    void close();

    boolean testSlackConnection();
}
