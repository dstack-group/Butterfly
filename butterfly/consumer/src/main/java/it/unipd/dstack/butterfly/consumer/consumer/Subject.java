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
