/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    consumer
 * @fileName:  AbstractSubject.java
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

package it.unipd.dstack.butterfly.consumer.consumer;

import it.unipd.dstack.butterfly.controller.record.Record;

import java.util.ArrayList;
import java.util.List;

public abstract class AbstractSubject<T> implements Subject<T> {
    private List<Observer<T>> observerList = new ArrayList<>();

    protected void notifyObservers(Record<T> record) {
        observerList.forEach(observer -> observer.update(record));
    }

    /**
     * Adds a new observer to the current event subject.
     *
     * @param observer
     */
    @Override
    public void addObserver(Observer<T> observer) {
        this.observerList.add(observer);
    }

    /**
     * Stops updating the previously registered observers.
     */
    @Override
    public void removeObservers() {
        this.observerList.clear();
    }
}
