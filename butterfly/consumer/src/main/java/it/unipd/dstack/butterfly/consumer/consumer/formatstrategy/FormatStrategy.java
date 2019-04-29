/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    consumer
 * @fileName:  FormatStrategy.java
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 * FormatStrategy defines the contract that must be respected when creating an appropriately formatted message
 * from an event object input.
 */

package it.unipd.dstack.butterfly.consumer.consumer.formatstrategy;

@FunctionalInterface
public interface FormatStrategy <T> {
    /**
     * Returns the appropriate formatted message from an event object input.
     * @param eventWithUserContact
     * @return
     */
    String format(T eventWithUserContact);
}
