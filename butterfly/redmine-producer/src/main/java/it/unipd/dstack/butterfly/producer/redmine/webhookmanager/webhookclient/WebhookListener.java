package it.unipd.dstack.butterfly.producer.redmine.webhookmanager.webhookclient;

import it.unipd.dstack.butterfly.producer.redmine.webhookmanager.webhookclient.model.IssueCreatedEvent;
import it.unipd.dstack.butterfly.producer.redmine.webhookmanager.webhookclient.model.IssueEditedEvent;

public interface WebhookListener {
    void onIssueCreatedEvent(IssueCreatedEvent event);

    void onIssueEditedEvent(IssueEditedEvent event);
}
