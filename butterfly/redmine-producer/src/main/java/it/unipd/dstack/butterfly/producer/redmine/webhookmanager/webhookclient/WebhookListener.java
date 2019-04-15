package it.unipd.dstack.butterfly.producer.redmine.webhookmanager.webhookclient;

import it.unipd.dstack.butterfly.producer.redmine.webhookmanager.webhookclient.model.IssueCreatedPayload;
import it.unipd.dstack.butterfly.producer.redmine.webhookmanager.webhookclient.model.IssueEditedPayload;

public interface WebhookListener {
    void onIssueCreatedEvent(IssueCreatedPayload event);

    void onIssueEditedEvent(IssueEditedPayload event);
}
