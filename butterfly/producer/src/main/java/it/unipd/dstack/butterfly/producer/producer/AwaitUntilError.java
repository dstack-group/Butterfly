package it.unipd.dstack.butterfly.producer.producer;

import java.util.function.Consumer;

public interface AwaitUntilError {
    /**
     * Blocks the current thread until an error is thrown or until the close() method is called.
     * @param onError action to be run when an error is thrown
     */
    void awaitUntilError(Consumer<Exception> onError);
}
