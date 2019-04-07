package it.unipd.dstack.butterfly.consumer.consumer;

import it.unipd.dstack.butterfly.controller.record.Record;

@FunctionalInterface
public interface OnConsumedMessage <T> {
    void apply(Record<T> record);
}
