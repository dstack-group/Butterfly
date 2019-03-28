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
}
