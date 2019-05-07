/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    slack-consumer
 * @fileName:  SlackMessage.java
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

package it.unipd.dstack.butterfly.consumer.slack.message;

import it.unipd.dstack.butterfly.consumer.consumer.message.Message;

public class SlackMessage extends Message {
    public SlackMessage(String contactRef, String content) {
        super(contactRef, content);
    }
}
