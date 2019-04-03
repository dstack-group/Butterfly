package it.unipd.dstack.butterfly.consumer.consumer;

import it.unipd.dstack.butterfly.common.record.Record;

import java.util.ArrayList;
import java.util.List;

public abstract class AbstractSubject<T> implements Subject<T> {
    private List<Observer<T>> observerList = new ArrayList<>();

    protected void notifyObservers(Record<T> record) {
        observerList.forEach(observer -> observer.update(record));
    }

    public void addObserver(Observer<T> observer) {
        this.observerList.add(observer);
    }
}
