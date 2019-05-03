/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    redmine-producer
 * @fileName:  RedmineWebhookClient.java
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

package it.unipd.dstack.butterfly.producer.redmine.webhookmanager.webhookclient;

import it.unipd.dstack.butterfly.jsonconverter.JSONConverter;
import it.unipd.dstack.butterfly.jsonconverter.JSONConverterImpl;
import it.unipd.dstack.butterfly.producer.redmine.webhookmanager.RedmineWebhookException;
import it.unipd.dstack.butterfly.producer.redmine.webhookmanager.webhookclient.model.RedmineEvent;
import it.unipd.dstack.butterfly.producer.redmine.webhookmanager.webhookclient.model.GeneralPayload;
import it.unipd.dstack.butterfly.producer.redmine.webhookmanager.webhookclient.model.IssueCreatedEvent;
import it.unipd.dstack.butterfly.producer.redmine.webhookmanager.webhookclient.model.IssueCreatedPayload;
import it.unipd.dstack.butterfly.producer.redmine.webhookmanager.webhookclient.model.IssueEditedEvent;
import it.unipd.dstack.butterfly.producer.redmine.webhookmanager.webhookclient.model.IssueEditedPayload;
import it.unipd.dstack.butterfly.producer.redmine.webhookmanager.webhookclient.utils.HttpRequestUtils;
import it.unipd.dstack.butterfly.producer.redmine.webhookmanager.webhookclient.utils.RedmineWebhookClientUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Set;
import java.util.concurrent.CopyOnWriteArrayList;

public class RedmineWebhookClient {
    private static final Logger logger = LoggerFactory.getLogger(RedmineWebhookClient.class);
    private final List<WebhookListener> webhookListeners = new CopyOnWriteArrayList<>();

    public static final JSONConverter jsonConverter = new JSONConverterImpl();

    /**
     * Redmine's priorities are saved as a lowercase only Set.
     */
    private final Set<String> prioritiesToConsider;

    public RedmineWebhookClient(Set<String> prioritiesToConsider) {
        this.prioritiesToConsider = RedmineWebhookClientUtils.transformToLowerCase(prioritiesToConsider);
    }

    /**
     * Adds a webhook event listener.
     *
     * @param listener the SystemHookListener to add
     */
    public void addListener(WebhookListener listener) {
        if (!webhookListeners.contains(listener)) {
            webhookListeners.add(listener);
        }
    }

    /**
     * Removes a webhook event listener.
     *
     * @param listener the SystemHookListener to remove
     */
    public void removeListener(WebhookListener listener) {
        webhookListeners.remove(listener);
    }

    /**
     * Parses and verifies an Event instance from the HTTP POST request and
     * fires it off to the registered listeners.
     *
     * @param request the HttpServletRequest to read the Event instance from
     * @throws RedmineWebhookException if the parsed event is not supported
     */
    public void handleEvent(HttpServletRequest request) throws RedmineWebhookException {
        try {
            String postData = HttpRequestUtils.getPostDataAsString(request);
            RedmineEvent redmineEvent = jsonConverter.fromJson(postData, RedmineEvent.class);
            GeneralPayload payload = redmineEvent.getPayload();
            logger.info("postData " + postData);

            logger.info("payload.getAction() " + payload.getAction());

            if (!this.matchesPrioritiesToConsider(payload)) {
                if (logger.isInfoEnabled()) {
                    logger.info("The priority is too low, discarding the current event");
                }
                return;
            }

            /**
             * Unfortunately the plugin redmine_webhook doesn't provide the type of event in a
             * HTTP header, so a first JSON deserialization is needed in order to determine the
             * even type of the current HTTP request.
             */
            if (payload.isNewIssue()) {
                IssueCreatedEvent event = jsonConverter.fromJson(postData, IssueCreatedEvent.class);
                this.fireIssueCreatedEvent(event.getPayload());
            } else if (payload.isUpdatedIssue()) {
                IssueEditedEvent event = jsonConverter.fromJson(postData, IssueEditedEvent.class);
                this.fireIssueEditedEvent(event.getPayload());
            } else {
                throw new RedmineWebhookException();
            }
        } catch (Exception e) {
            throw new RedmineWebhookException();
        }
    }

    private boolean matchesPrioritiesToConsider(GeneralPayload payload) {
        /**
         * The current issue priority needs to be converted to lower case since the <code>prioritiesToConsider</code>
         * Set is guaranteed to be lower case only.
         */
        String priority = payload.getIssue().getPriority().getName();
        return this.prioritiesToConsider.contains(priority.toLowerCase());
    }

    private void fireIssueCreatedEvent(IssueCreatedPayload event) {
        webhookListeners.forEach(listener -> listener.onIssueCreatedEvent(event));
    }

    private void fireIssueEditedEvent(IssueEditedPayload event) {
        webhookListeners.forEach(listener -> listener.onIssueEditedEvent(event));
    }
}
