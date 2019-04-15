package it.unipd.dstack.butterfly.producer.redmine.webhookmanager.webhookclient.model;

public class IssueCreatedPayload {
    Issue issue;
    String url;

    public Issue getIssue() {
        return issue;
    }

    public String getUrl() {
        return url;
    }
}
