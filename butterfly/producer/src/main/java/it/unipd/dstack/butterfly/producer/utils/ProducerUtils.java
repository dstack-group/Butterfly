package it.unipd.dstack.butterfly.producer.utils;

import org.apache.kafka.clients.producer.Callback;

import java.util.Arrays;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.function.Consumer;

public class ProducerUtils {
    private ProducerUtils() {}

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

    /**
     * Utility to retrieve a list of topics from a single string.
     * Example:
     * commaSeparatedValue: "TOPIC_1,TOPIC2,TOPIC3"
     * result: {"TOPIC_1", "TOPIC_2", "TOPIC_3"}
     *
     * @param commaSeparatedValue
     * @return
     */
    public static List<String> getListFromCommaSeparatedString(String commaSeparatedValue) {
        return Arrays.asList(commaSeparatedValue.split(","));
    }
}
