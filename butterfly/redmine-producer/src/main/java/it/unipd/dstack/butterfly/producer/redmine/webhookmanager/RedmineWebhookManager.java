/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    redmine-producer
 * @fileName:  RedmineWebhookManager.java
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
import it.unipd.dstack.butterfly.producer.redmine.webhookmanager.webhookclient.RedmineWebhookClient;
import it.unipd.dstack.butterfly.producer.redmine.webhookmanager.webhookclient.WebhookListener;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.http.HttpServletRequest;
import java.util.Set;

public class RedmineWebhookManager {
    private static final Logger logger = LoggerFactory.getLogger(RedmineWebhookManager.class);

    private final RedmineWebhookClient webHookManager;
    private final WebhookListener webHookListener;

    public RedmineWebhookManager(RedmineWebhookListener<Event> listener, Set<String> prioritiesToConsider) {
        this.webHookManager = new RedmineWebhookClient(prioritiesToConsider);
        this.webHookListener = new RedmineWebhookListenerObserver(listener);
        this.webHookManager.addListener(this.webHookListener);
    }

    public void onNewRedmineEvent(HttpServletRequest request) throws RedmineWebhookException {
        try {
            this.webHookManager.handleEvent(request);
            if (logger.isInfoEnabled()) {
                logger.info(String.format("NEW EVENT FROM %s", request.getRequestURI()));
            }
        } catch (RedmineWebhookException exception) {
            if (logger.isErrorEnabled()) {
                logger.error(String.format("REDMINE API EXCEPTION %s", exception.getStackTrace()));
            }
            throw exception;
        }
    }

    /**
     * Removes attached listeners
     */
    public void close() {
        this.webHookManager.removeListener(this.webHookListener);
    }
}
