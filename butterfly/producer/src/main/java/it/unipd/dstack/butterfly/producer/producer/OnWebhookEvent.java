/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    producer
 * @fileName:  OnWebhookEvent.java
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

package it.unipd.dstack.butterfly.producer.producer;

import java.util.concurrent.CompletableFuture;

@FunctionalInterface
public interface OnWebhookEvent <T> {
    /**
     * This method is called when a WebHook event has been received. The event object has info about the
     * specific event type and its data.
     * @param event
     */
    CompletableFuture<Void> handleEvent(T event);
}
