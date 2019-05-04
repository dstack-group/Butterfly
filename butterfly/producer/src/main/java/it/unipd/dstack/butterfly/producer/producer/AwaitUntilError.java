/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    producer
 * @fileName:  AwaitUntilError.java
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

package it.unipd.dstack.butterfly.producer.producer;

import java.util.function.Consumer;

public interface AwaitUntilError {
    /**
     * Blocks the current thread until an error is thrown or until the close() method is called.
     * @param onError action to be run when an error is thrown
     */
    void awaitUntilError(Consumer<Exception> onError);
}
