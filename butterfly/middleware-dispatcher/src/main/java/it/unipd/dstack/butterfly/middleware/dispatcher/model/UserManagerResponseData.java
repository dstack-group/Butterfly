package it.unipd.dstack.butterfly.middleware.dispatcher.model;

import it.unipd.dstack.butterfly.producer.avro.ServiceEventTypes;
import it.unipd.dstack.butterfly.producer.avro.Services;

import java.util.List;

public class UserManagerResponseData {
    private java.sql.Timestamp timestamp;
    private Services service;
    private String projectName;
    private String projectURL;
    private String eventId;
    private ServiceEventTypes eventType;
    private String title;
    private String description;
    private List<String> tags;
    private List<UserContact> userContacts;

    public java.sql.Timestamp getTimestamp() {
        return timestamp;
    }

    public Services getService() {
        return service;
    }

    public String getProjectName() {
        return projectName;
    }

    public String getProjectUrl() {
        return projectURL;
    }

    public String getEventId() {
        return eventId;
    }

    public ServiceEventTypes getEventType() {
        return eventType;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public List<String> getTags() {
        return tags;
    }

    public List<UserContact> getUserContacts() {
        return userContacts;
    }
}
