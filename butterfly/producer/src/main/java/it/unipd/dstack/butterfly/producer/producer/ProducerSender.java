package it.unipd.dstack.butterfly.producer.producer;

import it.unipd.dstack.butterfly.controller.record.Record;
import it.unipd.dstack.butterfly.producer.utils.ProducerUtils;

import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

public interface ProducerSender <T> {
    /**
     * Asynchronously produce a Record element
     * @param record
     * @return
     */
    CompletableFuture<Void> send(Record<T> record);

    /**
     * Asynchronously produce a list of Record elements
     * @param recordList
     * @return
     */
    default CompletableFuture<Void> send(List<Record<T>> recordList) {
        var completableFutureList = recordList
                .stream()
                .map(this::send)
                .collect(Collectors.toList());
        return ProducerUtils.composeFutureList(completableFutureList);
    }
}
