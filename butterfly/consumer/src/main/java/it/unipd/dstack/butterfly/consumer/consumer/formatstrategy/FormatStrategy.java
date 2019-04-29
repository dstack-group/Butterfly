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
 */

package it.unipd.dstack.butterfly.consumer.consumer.formatstrategy;

@FunctionalInterface
public interface FormatStrategy <T> {
    /**
     * Returns the appropriate formatted message from an input event object.
     * @param eventWithUserContact
     * @return
     */
    String format(T eventWithUserContact);
}
