package it.unipd.dstack.butterfly.producer.redmine.webhookmanager.webhookclient.model;

import java.sql.Date;

public class Issue {
    private long id;
    private String subject;
    private String description;
    private Date createdOn;
    private Date updatedOn;
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

    public String getDescription() {
        return description;
    }

    public Date getCreatedOn() {
        return createdOn;
    }

    public Date getUpdatedOn() {
        return updatedOn;
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