/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    consumer
 * @fileName:  Subject.java
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 * Subject contains the definition of an Observer Pattern Subject, which is the entity that
 * adds and removes observers.
 */

package it.unipd.dstack.butterfly.consumer.consumer;

public interface Subject<T> {
    /**
     * Adds a new observer to the current event subject.
     * @param observer
     */
    void addObserver(Observer<T> observer);

    /**
     * Stops updating the previously registered observers.
     */
    void removeObservers();
}
