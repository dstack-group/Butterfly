/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    producer
 * @fileName:  ProducerSender.java
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
