package it.unipd.dstack.butterfly.producer.redmine.webhookmanager.webhookclient.model;

public class Issue {
    private long id;
    private String subject;
    private int doneRatio;
    private int estimatedHours;
    private Project project;

    private SimpleEntity status;

    private SimpleEntity tracker;

    private SimpleEntity priority;

    private User author;

    private User assignee;

    public long getId() {
        return id;
    }

    public String getSubject() {
        return subject;
    }

    public int getDoneRatio() {
        return doneRatio;
    }

    public int getEstimatedHours() {
        return estimatedHours;
    }

    public Project getProject() {
        return project;
    }

    public SimpleEntity getStatus() {
        return status;
    }

    public SimpleEntity getTracker() {
        return tracker;
    }

    public SimpleEntity getPriority() {
        return priority;
    }

    public User getAuthor() {
        return author;
    }

    public User getAssignee() {
        return assignee;
    }
}
