package it.unipd.dstack.butterfly.producer.gitlab.webhookmanager;

import it.unipd.dstack.butterfly.producer.avro.Event;
import it.unipd.dstack.butterfly.producer.avro.ServiceEventTypes;
import it.unipd.dstack.butterfly.producer.avro.Services;
import org.apache.avro.AvroRuntimeException;
import org.gitlab4j.api.webhook.IssueEvent;
import org.gitlab4j.api.webhook.PushEvent;
import org.gitlab4j.api.webhook.WebHookListener;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * GitlabWebhookListenerAggregator is a concrete implementation of the third-party interface WebHookListener.
 * Each time an event is fired, it converts it into an Event object that the given GitlabWebhookListener instance
 * is able to understand.
 */
public class GitlabWebhookListenerObserver implements WebHookListener {
    private static final Logger logger = LoggerFactory.getLogger(GitlabWebhookListenerObserver.class);

    private final GitlabWebhookListener<Event> listener;

    public GitlabWebhookListenerObserver(GitlabWebhookListener<Event> listener) {
        this.listener = listener;
    }

    /**
     * This method is called when a WebHook merge request event has been received.
     * It dispatches a single Avro serialized Event that represents a Gitlab Merge Request Event.
     * Not currently supported.
     *
     * @param mergeRequestEvent the EventObject instance containing info on the merge request
     */
    /*
    public void onMergeRequestEvent(MergeRequestEvent mergeRequestEvent) {
        logger.info("Creating AVRO Event onMergeRequestEvent");
        Event.Builder eventBuilder = Event.newBuilder();
        eventBuilder.setTimestamp(mergeRequestEvent.getObjectAttributes().getCreatedAt().getTime());
        eventBuilder.setService(Services.GITLAB);
        eventBuilder.setProjectName(mergeRequestEvent.getProject().getName());
        eventBuilder.setProjectURL(mergeRequestEvent.getProject().getGitHttpUrl());
        eventBuilder.setEventId(mergeRequestEvent.getObjectAttributes().getId().toString());
        eventBuilder.setEventType(ServiceEventTypes.GITLAB_MERGE_REQUEST_CREATED);
        eventBuilder.setUserEmail(mergeRequestEvent.getUser().getEmail());
        eventBuilder.setTitle(mergeRequestEvent.getObjectAttributes().getTitle());
        eventBuilder.setDescription(mergeRequestEvent.getObjectAttributes().getDescription());
        Event event = eventBuilder.build();

        this.listener.onNewGitlabEvent(event);
        logger.info("Created AVRO Event after onMergeRequestEvent");
    }
    */

    /**
     * This method is called when a WebHook push event has been received.
     * It dispatches a number of Avro serialized Events that represent a Gitlab Push Event.
     * If multiple commits are retrieved at once, a single Event is dispatched for each commit.
     *
     * @param pushEvent the PushEvent instance
     */
    public void onPushEvent(PushEvent pushEvent) {
        logger.info("Creating AVRO Event onPushEvent");
        var commits = pushEvent.getCommits();

        commits.stream().map(commit -> {
            Event.Builder eventBuilder = Event.newBuilder();
            eventBuilder.setTimestamp(commit.getTimestamp().getTime());
            eventBuilder.setService(Services.GITLAB);
            eventBuilder.setProjectName(pushEvent.getProject().getName());
            eventBuilder.setProjectURL(pushEvent.getProject().getGitHttpUrl());
            eventBuilder.setEventId(commit.getId());
            eventBuilder.setEventType(ServiceEventTypes.GITLAB_COMMIT_CREATED);
            eventBuilder.setUsername(pushEvent.getUserName());
            eventBuilder.setUserEmail(pushEvent.getUserEmail());
            eventBuilder.setTitle(pushEvent.getBranch());
            eventBuilder.setDescription(commit.getMessage());
            return eventBuilder.build();
        }).forEach(this.listener::onCommitCreatedEvent);
        logger.info("Created AVRO Event after onPushEvent");
    }

    /**
     * This method is called when a WebHook issue event has been received.
     * It dispatches a single Avro serialized Event that represents a Gitlab Issue Event.
     *
     * @param issueEvent the IssueEvent instance
     */
    public void onIssueEvent(IssueEvent issueEvent) {
        logger.info("Creating AVRO Event onIssueEvent " + issueEvent.toString());
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
            eventBuilder.setProjectURL(issueEvent.getProject().getGitHttpUrl());
            eventBuilder.setEventId(issueEvent.getObjectAttributes().getId().toString());
            eventBuilder.setEventType(serviceEventTypes);
            eventBuilder.setUsername(issueEvent.getUser().getUsername());
            eventBuilder.setUserEmail(issueEvent.getUser().getEmail());
            eventBuilder.setTitle(issueEvent.getObjectAttributes().getTitle());
            eventBuilder.setDescription(issueEvent.getObjectAttributes().getDescription());
            Event event = eventBuilder.build();

            if (isIssueEditedEvent) {
                this.listener.onIssueEditedEvent(event);
            } else {
                this.listener.onIssueCreatedEvent(event);
            }

            logger.info("Created AVRO Event after onIssueEvent");
        } catch (AvroRuntimeException e) {
            logger.error("AvroRuntimeException: " + e.getMessage() + " " + e.getStackTrace());
        }
    }
}
