/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    consumer
 * @fileName:  Observer.java
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 * Observer is the core interface of the Observer Pattern. It's responsible of triggering update events,
 * which are then propagated to the subscribers via a Subject implementation.
 */

package it.unipd.dstack.butterfly.consumer.consumer;

import it.unipd.dstack.butterfly.controller.record.Record;

public interface Observer<T> {
    void update(Record<T> record);
}
