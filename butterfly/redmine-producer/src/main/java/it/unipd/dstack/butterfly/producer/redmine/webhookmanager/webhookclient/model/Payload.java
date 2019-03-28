package it.unipd.dstack.butterfly.producer.redmine.webhookmanager.webhookclient.model;

public class Payload extends WebhookEvent {
    private String action;
    private Issue issue;
    private String url;

    public String getAction() {
        return action;
    }

    public Issue getIssue() {
        return issue;
    }

    public String getUrl() {
        return url;
    }
}
