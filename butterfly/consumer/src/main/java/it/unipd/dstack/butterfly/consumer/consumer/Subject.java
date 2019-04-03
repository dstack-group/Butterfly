package it.unipd.dstack.butterfly.consumer.consumer;

public interface Subject<T> {
    void addObserver(Observer<T> observer);
}
