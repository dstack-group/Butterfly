package it.unipd.dstack.butterfly.consumer.consumer;

import it.unipd.dstack.butterfly.common.record.Record;

public interface Observer<T> {
    void update(Record<T> record);
}
