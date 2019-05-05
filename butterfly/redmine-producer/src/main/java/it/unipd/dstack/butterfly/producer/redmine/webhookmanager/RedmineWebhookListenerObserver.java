/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    redmine-producer
 * @fileName:  RedmineWebhookListenerObserver.java
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

package it.unipd.dstack.butterfly.producer.redmine.webhookmanager;

import it.unipd.dstack.butterfly.producer.avro.Event;
import it.unipd.dstack.butterfly.producer.avro.ServiceEventTypes;
import it.unipd.dstack.butterfly.producer.avro.Services;
import it.unipd.dstack.butterfly.producer.redmine.webhookmanager.webhookclient.WebhookListener;
import it.unipd.dstack.butterfly.producer.redmine.webhookmanager.webhookclient.model.IssueCreatedPayload;
import it.unipd.dstack.butterfly.producer.redmine.webhookmanager.webhookclient.model.IssueEditedPayload;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

public class RedmineWebhookListenerObserver implements WebhookListener {
    private static final Logger logger = LoggerFactory.getLogger(RedmineWebhookListenerObserver.class);
    private final RedmineWebhookListener<Event> listener;

    public RedmineWebhookListenerObserver(RedmineWebhookListener<Event> listener) {
        this.listener = listener;
    }

    @Override
    public void onIssueCreatedEvent(IssueCreatedPayload issueEvent) {
        Event.Builder eventBuilder = Event.newBuilder();
        eventBuilder.setTimestamp(issueEvent.getIssue().getUpdatedOn().getTime());
        eventBuilder.setService(Services.REDMINE);
        eventBuilder.setProjectName(issueEvent.getIssue().getProject().getName());
        eventBuilder.setProjectURL(issueEvent.getIssue().getProject().getHomepage());
        eventBuilder.setEventId(WebhookManagerUtils.longToString(issueEvent.getIssue().getId()));
        eventBuilder.setEventType(ServiceEventTypes.REDMINE_TICKET_CREATED);
        eventBuilder.setUsername(issueEvent.getIssue().getAuthor().getLogin());
        eventBuilder.setUserEmail(issueEvent.getIssue().getAuthor().getMail());
        eventBuilder.setTitle(issueEvent.getIssue().getSubject());
        eventBuilder.setDescription(issueEvent.getIssue().getDescription());

        List<String> tags = List.of(issueEvent.getIssue().getTracker().getName());
        eventBuilder.setTags(tags);

        Event event = eventBuilder.build();
        this.listener.onIssueCreatedEvent(event);

        logger.info("Created AVRO Event after onIssueCreatedEvent");
    }

    @Override
    public void onIssueEditedEvent(IssueEditedPayload issueEvent) {
        Event.Builder eventBuilder = Event.newBuilder();
        eventBuilder.setTimestamp(issueEvent.getIssue().getUpdatedOn().getTime());
        eventBuilder.setService(Services.REDMINE);
        eventBuilder.setProjectName(issueEvent.getIssue().getProject().getName());
        eventBuilder.setProjectURL(issueEvent.getIssue().getProject().getHomepage());
        eventBuilder.setEventId(WebhookManagerUtils.longToString(issueEvent.getIssue().getId()));
        eventBuilder.setEventType(ServiceEventTypes.REDMINE_TICKET_EDITED);
        eventBuilder.setUsername(issueEvent.getIssue().getAuthor().getLogin());
        eventBuilder.setUserEmail(issueEvent.getIssue().getAuthor().getMail());
        eventBuilder.setTitle(issueEvent.getIssue().getSubject());
        eventBuilder.setDescription(issueEvent.getIssue().getDescription());

        List<String> tags = List.of(issueEvent.getIssue().getTracker().getName());
        eventBuilder.setTags(tags);

        Event event = eventBuilder.build();
        this.listener.onIssueEditedEvent(event);

        logger.info("Created AVRO Event after onIssueEditedEvent");
    }
}
