package it.unipd.dstack.butterfly.producer.redmine.webhookmanager.webhookclient.model;

public class Project {
    private long id;
    private String identifier;
    private String name;
    private String description;
    private String homepage;

    public long getId() {
        return id;
    }

    public String getIdentifier() {
        return identifier;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public String getHomepage() {
        return homepage;
    }
}
