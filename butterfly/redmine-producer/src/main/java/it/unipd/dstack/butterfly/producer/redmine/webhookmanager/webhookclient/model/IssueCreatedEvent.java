package it.unipd.dstack.butterfly.producer.redmine.webhookmanager.webhookclient.model;

public class IssueCreatedEvent {
    private IssueCreatedPayload payload;

    public IssueCreatedPayload getPayload() {
        return payload;
    }
}
