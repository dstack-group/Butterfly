package it.unipd.dstack.butterfly.producer.redmine.webhookmanager.webhookclient.model;

public class JournalDetail {
    private long id;
    private String notes;
    private boolean privateNotes;
    private User author;

    public long getId() {
        return id;
    }

    public String getNotes() {
        return notes;
    }

    public boolean getPrivateNotes() {
        return privateNotes;
    }

    public User getAuthor() {
        return author;
    }
}
