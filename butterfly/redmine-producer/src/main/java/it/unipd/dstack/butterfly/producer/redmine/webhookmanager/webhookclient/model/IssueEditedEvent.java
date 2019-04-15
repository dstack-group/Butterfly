package it.unipd.dstack.butterfly.producer.redmine.webhookmanager.webhookclient.model;

public class IssueEditedEvent {
    private IssueEditedPayload payload;

    public IssueEditedPayload getPayload() {
        return payload;
    }
}
