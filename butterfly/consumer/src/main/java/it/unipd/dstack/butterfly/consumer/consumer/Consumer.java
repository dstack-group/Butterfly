/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    consumer
 * @fileName:  Consumer.java
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 * Consumer declares the contract that each third party services consumer should respect.
 */

package it.unipd.dstack.butterfly.consumer.consumer;

public interface Consumer<T> extends ConsumerReceiver, Closeable, Subject<T> {
    /**
     * Starts consuming messages
     */
    void start();
}
