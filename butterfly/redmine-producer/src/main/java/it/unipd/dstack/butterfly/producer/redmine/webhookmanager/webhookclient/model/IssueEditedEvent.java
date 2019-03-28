package it.unipd.dstack.butterfly.producer.redmine.webhookmanager.webhookclient.model;

public class IssueEditedEvent extends Payload {
    public static final String EventKind = "ISSUE_EDITED";

    private Journal journal;

    public Journal getJournal() {
        return journal;
    }
}
