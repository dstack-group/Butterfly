/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    producer
 * @fileName:  ProducerUtilsTest.java
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

package it.unipd.dstack.butterfly.producer.utils;

import org.apache.kafka.clients.producer.Callback;
import org.apache.kafka.clients.producer.RecordMetadata;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CountDownLatch;
import java.util.function.Consumer;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

public class ProducerUtilsTest {
    @Test
    public void canParseCommaSeparatedString() {
        String commaSeparatedString = "TELEGRAM,EMAIL,SLACK";
        List<String> stringList = ProducerUtils.getListFromCommaSeparatedString(commaSeparatedString);

        assertEquals(3, stringList.size());
        assertEquals("TELEGRAM", stringList.get(0));
        assertEquals("EMAIL", stringList.get(1));
        assertEquals("SLACK", stringList.get(2));
    }

    @Test
    public void canComposeListOfCompletableFutures() throws Exception {
        CountDownLatch latch = new CountDownLatch(3);
        CountDownLatch splyLatch = spy(latch);
        doCallRealMethod().when(splyLatch).countDown();

        CompletableFuture<Void> first = CompletableFuture.supplyAsync(() -> {
            splyLatch.countDown();
            return null;
        });
        CompletableFuture<Void> second = CompletableFuture.supplyAsync(() -> {
            splyLatch.countDown();
            return null;
        });
        CompletableFuture<Void> third = CompletableFuture.supplyAsync(() -> {
            splyLatch.countDown();
            return null;
        });

        var completableFutureList = List.of(first, second, third);
        var composedCompletableFuture = ProducerUtils.composeFutureList(completableFutureList);

        composedCompletableFuture
                .thenRun(() -> {
                    verify(splyLatch, times(3)).countDown();
                });

        latch.await();
    }

    @Test
    public void getCompletableFutureShouldThrowIfCallbackHasException() throws Exception {
        RecordMetadata recordMetadata = new RecordMetadata(null, 0, 0, 0, null, 0, 0);

        Consumer<Callback> callbackConsumer = (Callback callback) -> {
            callback.onCompletion(recordMetadata, new NumberFormatException());
        };

        var completableFutureCallback = ProducerUtils.getCompletableFuture(callbackConsumer);

        completableFutureCallback
                .thenRun(() -> {
                    throw new RuntimeException();
                })
                .exceptionally(e -> {
                    Assertions.assertThrows(NumberFormatException.class, () -> {
                        throw e;
                    });
                    return null;
                });
    }

    @Test
    public void getCompletableFutureShouldReturnNullIfCallbackIsSuccessful() throws Exception {
        RecordMetadata recordMetadata = new RecordMetadata(null, 0, 0, 0, null, 0, 0);

        Consumer<Callback> callbackConsumer = (Callback callback) -> {
            callback.onCompletion(recordMetadata, null);
        };

        var completableFutureCallback = ProducerUtils.getCompletableFuture(callbackConsumer);

        assertEquals(null, completableFutureCallback.get());
    }
}