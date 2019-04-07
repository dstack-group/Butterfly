package it.unipd.dstack.butterfly.producer.producer;

import it.unipd.dstack.butterfly.controller.record.Record;

import java.util.List;
import java.util.concurrent.CompletableFuture;

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
    CompletableFuture<Void> send(List<Record<T>> recordList);
}
