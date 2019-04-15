package it.unipd.dstack.butterfly.producer.redmine.webhookmanager;

import it.unipd.dstack.butterfly.producer.avro.Event;
import it.unipd.dstack.butterfly.producer.avro.ServiceEventTypes;
import it.unipd.dstack.butterfly.producer.avro.Services;
import it.unipd.dstack.butterfly.producer.redmine.webhookmanager.webhookclient.WebhookListener;
import it.unipd.dstack.butterfly.producer.redmine.webhookmanager.webhookclient.model.IssueCreatedPayload;
import it.unipd.dstack.butterfly.producer.redmine.webhookmanager.webhookclient.model.IssueEditedPayload;
import org.apache.avro.AvroRuntimeException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class RedmineWebhookListenerObserver implements WebhookListener {
    private static final Logger logger = LoggerFactory.getLogger(RedmineWebhookListenerObserver.class);
    private final RedmineWebhookListener<Event> listener;

    public RedmineWebhookListenerObserver(RedmineWebhookListener<Event> listener) {
        this.listener = listener;
    }

    @Override
    public void onIssueCreatedEvent(IssueCreatedPayload issueEvent) {
        try {
            Event.Builder eventBuilder = Event.newBuilder();
            // TODO: retrieve timestamp
            // eventBuilder.setTimestamp();
            eventBuilder.setService(Services.REDMINE);
            eventBuilder.setProjectName(issueEvent.getIssue().getProject().getName());
            eventBuilder.setProjectURL(issueEvent.getIssue().getProject().getHomepage());
            eventBuilder.setEventId(Long.toString(issueEvent.getIssue().getId())); // TODO: extract to utils
            eventBuilder.setEventType(ServiceEventTypes.REDMINE_TICKET_CREATED);
            eventBuilder.setUsername(issueEvent.getIssue().getAuthor().getLogin());
            eventBuilder.setUserEmail(issueEvent.getIssue().getAuthor().getEmail());
            eventBuilder.setTitle(issueEvent.getIssue().getSubject());
            eventBuilder.setDescription(issueEvent.getIssue().getDescription());
            Event event = eventBuilder.build();
            this.listener.onIssueCreatedEvent(event);

            logger.info("Created AVRO Event after onIssueCreatedEvent");
        } catch (AvroRuntimeException e) {
            logger.error("AvroRuntimeException: " + e.getMessage() + " " + e.getStackTrace());
        }
    }

    @Override
    public void onIssueEditedEvent(IssueEditedPayload issueEvent) {
        try {
            Event.Builder eventBuilder = Event.newBuilder();
            // TODO: retrieve timestamp
            // eventBuilder.setTimestamp();
            eventBuilder.setService(Services.REDMINE);
            eventBuilder.setProjectName(issueEvent.getIssue().getProject().getName());
            eventBuilder.setProjectURL(issueEvent.getIssue().getProject().getHomepage());
            eventBuilder.setEventId(Long.toString(issueEvent.getIssue().getId())); // TODO: extract to utils
            eventBuilder.setEventType(ServiceEventTypes.REDMINE_TICKET_EDITED);
            eventBuilder.setUsername(issueEvent.getIssue().getAuthor().getLogin());
            eventBuilder.setUserEmail(issueEvent.getIssue().getAuthor().getEmail());
            eventBuilder.setTitle(issueEvent.getIssue().getSubject());
            eventBuilder.setDescription(issueEvent.getIssue().getDescription());
            Event event = eventBuilder.build();
            this.listener.onIssueCreatedEvent(event);

            logger.info("Created AVRO Event after onIssueEditedEvent");
        } catch (AvroRuntimeException e) {
            logger.error("AvroRuntimeException: " + e.getMessage() + " " + e.getStackTrace());
        }
    }
}
