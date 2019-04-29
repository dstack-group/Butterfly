/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    event-processor
 * @fileName:  UnprocessableEventException.java
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

package it.unipd.dstack.butterfly.eventprocessor;

public class UnprocessableEventException extends RuntimeException {
    public UnprocessableEventException(RuntimeException e) {
        super(UnprocessableEventException.buildMessage(e));
    }

    private static String buildMessage(RuntimeException e) {
        return String.format("Cannot process event due to exception: %s", e.getMessage());
    }
}