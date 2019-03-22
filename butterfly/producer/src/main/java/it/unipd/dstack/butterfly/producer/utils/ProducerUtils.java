package it.unipd.dstack.butterfly.producer.utils;

import org.apache.kafka.clients.producer.Callback;

import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.function.Consumer;

public class ProducerUtils {
    public static <T> CompletableFuture<Void> composeFutureList(List<CompletableFuture<T>> completableFutureList) {
        CompletableFuture<T>[] completableFutureArray =
                new CompletableFuture[completableFutureList.size()];
        completableFutureArray = completableFutureList.toArray(completableFutureArray);
        return CompletableFuture.allOf(completableFutureArray);
    }

    public static CompletableFuture<Void> getCompletableFuture(Consumer<Callback> supplier) {
        CompletableFuture<Void> completableFuture = new CompletableFuture<>();
        Callback callback = (recordMetadata, exception) -> {
            if (exception == null) {
                completableFuture.complete(null);
            } else {
                completableFuture.completeExceptionally(exception);
            }
        };

        supplier.accept(callback);
        return completableFuture;
    }
}
