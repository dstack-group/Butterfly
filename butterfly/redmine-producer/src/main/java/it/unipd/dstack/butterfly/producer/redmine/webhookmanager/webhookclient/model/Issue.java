/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    redmine-producer
 * @fileName:  Issue.java
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