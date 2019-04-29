/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    consumer
 * @fileName:  MessageSender.java
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 * MessageSender defines the contract that must be respected when sending a message to a third party service.
 */

package it.unipd.dstack.butterfly.consumer.consumer.message;

public interface MessageSender <T extends Message> {
    /**
     * Forwards the given messaage to the appropriate service.
     * @param message
     */
    void sendMessage(T message);
}
