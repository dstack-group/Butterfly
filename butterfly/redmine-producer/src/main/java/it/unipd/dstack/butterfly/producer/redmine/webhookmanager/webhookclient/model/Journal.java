/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    redmine-producer
 * @fileName:  Journal.java
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

package it.unipd.dstack.butterfly.producer.redmine.webhookmanager.webhookclient.model;

import java.util.List;

public class Journal {
    private long id;
    private String notes;
    private User author;
    private List<JournalDetail> details;

    public long getId() {
        return id;
    }

    public String getNotes() {
        return notes;
    }

    public User getAuthor() {
        return author;
    }

    public List<JournalDetail> getDetails() {
        return details;
    }
}
