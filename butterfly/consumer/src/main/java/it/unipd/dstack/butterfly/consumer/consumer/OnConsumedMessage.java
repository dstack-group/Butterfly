package it.unipd.dstack.butterfly.consumer.consumer;

import it.unipd.dstack.butterfly.config.record.Record;

@FunctionalInterface
public interface OnConsumedMessage <T> {
    void apply(Record<T> record);
}
