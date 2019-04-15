package it.unipd.dstack.butterfly.producer.redmine.webhookmanager.webhookclient.model;

public class IssueEditedPayload {
    Issue issue;
    Journal journal;
    String url;

    public Issue getIssue() {
        return issue;
    }

    public Journal getJournal() {
        return journal;
    }

    public String getUrl() {
        return url;
    }
}
