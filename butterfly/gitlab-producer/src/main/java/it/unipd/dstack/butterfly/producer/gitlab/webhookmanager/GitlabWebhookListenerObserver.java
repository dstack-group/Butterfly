/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    gitlab-producer
 * @fileName:  GitlabWebhookListenerObserver.java
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

package it.unipd.dstack.butterfly.producer.gitlab.webhookmanager;

import it.unipd.dstack.butterfly.producer.avro.Event;
import it.unipd.dstack.butterfly.producer.avro.ServiceEventTypes;
import it.unipd.dstack.butterfly.producer.avro.Services;
import org.apache.avro.AvroRuntimeException;
import org.gitlab4j.api.webhook.IssueEvent;
import org.gitlab4j.api.webhook.MergeRequestEvent;
import org.gitlab4j.api.webhook.PushEvent;
import org.gitlab4j.api.webhook.WebHookListener;
import org.gitlab4j.api.webhook.EventLabel;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Consumer;
import java.util.stream.Collectors;

/**
 * GitlabWebhookListenerObserver is a concrete implementation of the third-party interface WebHookListener.
 * Each time an event is fired, it converts it into an Event object that the given GitlabWebhookListener instance
 * is able to understand.
 */
class GitlabWebhookListenerObserver implements WebHookListener {
    private static final Logger logger = LoggerFactory.getLogger(GitlabWebhookListenerObserver.class);

    private final GitlabWebhookListener<Event> listener;
    private final Map<String, EventTypeAndListenerPair> actionServiceEventTypeMap = new HashMap<>();

    public GitlabWebhookListenerObserver(GitlabWebhookListener<Event> listener) {
        this.listener = listener;
        this.actionServiceEventTypeMap.put("open", new EventTypeAndListenerPair(
                ServiceEventTypes.GITLAB_MERGE_REQUEST_CREATED, this.listener::onMergeRequestCreatedEvent));
        this.actionServiceEventTypeMap.put("update", new EventTypeAndListenerPair(
                ServiceEventTypes.GITLAB_MERGE_REQUEST_EDITED, this.listener::onMergeRequestEditedEvent));
        this.actionServiceEventTypeMap.put("merge", new EventTypeAndListenerPair(
                ServiceEventTypes.GITLAB_MERGE_REQUEST_MERGED, this.listener::onMergeRequestMergedEvent));
        this.actionServiceEventTypeMap.put("close", new EventTypeAndListenerPair(
                ServiceEventTypes.GITLAB_MERGE_REQUEST_CLOSED, this.listener::onMergeRequestClosedEvent));
    }

    private static class EventTypeAndListenerPair {
        final ServiceEventTypes serviceEventType;
        final Consumer<Event> eventConsumer;

        public EventTypeAndListenerPair(ServiceEventTypes serviceEventType, Consumer<Event> eventConsumer) {
            this.serviceEventType = serviceEventType;
            this.eventConsumer = eventConsumer;
        }
    }

    private EventTypeAndListenerPair getEventTypeAndListenerFromMergeRequestEvent(MergeRequestEvent mergeRequestEvent) {
        String action = mergeRequestEvent.getObjectAttributes().getAction();
        return this.actionServiceEventTypeMap.get(action);
    }

    /**
     * This method is called when a WebHook merge request event has been received.
     * It dispatches a single Avro serialized Event that represents a Gitlab Merge Request Event.
     * Not currently supported.
     *
     * @param mergeRequestEvent the EventObject instance containing info on the merge request
     */
    @Override
    public void onMergeRequestEvent(MergeRequestEvent mergeRequestEvent) {
        logger.info("Creating AVRO Event onMergeRequestEvent");
        var eventTypeAndListenerPair = this.getEventTypeAndListenerFromMergeRequestEvent(mergeRequestEvent);
        var eventId = mergeRequestEvent.getObjectAttributes().getId();
        Event.Builder eventBuilder = Event.newBuilder();
        eventBuilder.setTimestamp(mergeRequestEvent.getObjectAttributes().getCreatedAt().getTime());
        eventBuilder.setService(Services.GITLAB);
        eventBuilder.setProjectName(mergeRequestEvent.getProject().getName());
        eventBuilder.setProjectURL(mergeRequestEvent.getProject().getWebUrl());
        eventBuilder.setEventId(WebhookManagerUtils.numberToString(eventId));
        eventBuilder.setEventType(eventTypeAndListenerPair.serviceEventType);

        // state.equals("opened") && action.equals("open") -> ServiceEventTypes.GITLAB_MERGE_REQUEST_CREATED
        // state.equals("opened") && action.equals("update") -> ServiceEventTypes.GITLAB_MERGE_REQUEST_EDITED
        // state.equals("merged") && action.equals("merge") -> ServiceEventTypes.GITLAB_MERGE_REQUEST_MERGED
        // state.equals("closed") && action.equals("close") -> ServiceEventTypes.GITLAB_MERGE_REQUEST_CLOSED

        eventBuilder.setUsername(mergeRequestEvent.getUser().getUsername());
        eventBuilder.setUserEmail(mergeRequestEvent.getUser().getEmail());
        eventBuilder.setTitle(mergeRequestEvent.getObjectAttributes().getTitle());
        eventBuilder.setDescription(mergeRequestEvent.getObjectAttributes().getDescription());
        Event event = eventBuilder.build();

        eventTypeAndListenerPair.eventConsumer.accept(event);
        logger.info("Created AVRO Event after onMergeRequestEvent");
    }

    /**
     * This method is called when a WebHook push event has been received.
     * It dispatches a number of Avro serialized Events that represent a Gitlab Push Event.
     * If multiple commits are retrieved at once, a single Event is dispatched for each commit.
     *
     * @param pushEvent the PushEvent instance
     */
    @Override
    public void onPushEvent(PushEvent pushEvent) {
        if (logger.isInfoEnabled()) {
            logger.info("Creating AVRO Event onPushEvent");
        }

        var commits = pushEvent.getCommits();

        commits.stream().map(commit -> {
            Event.Builder eventBuilder = Event.newBuilder();
            eventBuilder.setTimestamp(commit.getTimestamp().getTime());
            eventBuilder.setService(Services.GITLAB);
            eventBuilder.setProjectName(pushEvent.getProject().getName());
            eventBuilder.setProjectURL(pushEvent.getProject().getWebUrl());
            eventBuilder.setEventId(commit.getId());
            eventBuilder.setEventType(ServiceEventTypes.GITLAB_COMMIT_CREATED);
            eventBuilder.setUsername(pushEvent.getUserName());
            eventBuilder.setUserEmail(pushEvent.getUserEmail());
            eventBuilder.setTitle(pushEvent.getBranch());
            eventBuilder.setDescription(commit.getMessage());
            return eventBuilder.build();
        }).forEach(this.listener::onCommitCreatedEvent);

        if (logger.isInfoEnabled()) {
            logger.info("Created AVRO Event after onPushEvent");
        }
    }

    /**
     * This method is called when a WebHook issue event has been received.
     * It dispatches a single Avro serialized Event that represents a Gitlab Issue Event.
     *
     * @param issueEvent the IssueEvent instance
     */
    @Override
    public void onIssueEvent(IssueEvent issueEvent) {
        if (logger.isInfoEnabled()) {
            logger.info(String.format("Creating AVRO Event onIssueEvent %s", issueEvent.toString()));
        }

        var createdAt = issueEvent.getObjectAttributes().getCreatedAt().getTime();
        var updatedAt = issueEvent.getObjectAttributes().getUpdatedAt().getTime();

        /**
         * Apparently the only way to discriminate between a new issue or an edited issue is comparing
         * the timestamps in which the issue was created and updated.
         */
        boolean isIssueEditedEvent = updatedAt > createdAt;
        ServiceEventTypes serviceEventTypes = isIssueEditedEvent ?
                ServiceEventTypes.GITLAB_ISSUE_EDITED :
                ServiceEventTypes.GITLAB_ISSUE_CREATED;

        try {
            Event.Builder eventBuilder = Event.newBuilder();
            eventBuilder.setTimestamp(issueEvent.getObjectAttributes().getCreatedAt().getTime());
            eventBuilder.setService(Services.GITLAB);
            eventBuilder.setProjectName(issueEvent.getProject().getName());
            eventBuilder.setProjectURL(issueEvent.getProject().getWebUrl());
            eventBuilder.setEventId(issueEvent.getObjectAttributes().getId().toString());
            eventBuilder.setEventType(serviceEventTypes);
            eventBuilder.setUsername(issueEvent.getUser().getUsername());
            eventBuilder.setUserEmail(issueEvent.getUser().getEmail());
            eventBuilder.setTitle(issueEvent.getObjectAttributes().getTitle());
            eventBuilder.setDescription(issueEvent.getObjectAttributes().getDescription());
            eventBuilder.setTags(this.getStringsFromIssueLabels(issueEvent.getLabels()));
            Event event = eventBuilder.build();

            if (isIssueEditedEvent) {
                this.listener.onIssueEditedEvent(event);
            } else {
                this.listener.onIssueCreatedEvent(event);
            }

            if (logger.isInfoEnabled()) {
                logger.info("Created AVRO Event after onIssueEvent");
            }
        } catch (AvroRuntimeException e) {
            if (logger.isErrorEnabled()) {
                logger.error(String.format("AvroRuntimeException: %s %s", e.getMessage(), e.getStackTrace()));
            }
        }
    }

    private List<String> getStringsFromIssueLabels(List<EventLabel> eventLabelList) {
        return eventLabelList.stream()
            .map(EventLabel::getTitle)
            .collect(Collectors.toList());
    }
}
