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
