/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    gitlab-producer
 * @fileName:  GitlabWebhookManager.java
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
import org.gitlab4j.api.GitLabApiException;
import org.gitlab4j.api.webhook.WebHookListener;
import org.gitlab4j.api.webhook.WebHookManager;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.http.HttpServletRequest;

public class GitlabWebhookManager {
    private static final Logger logger = LoggerFactory.getLogger(GitlabWebhookManager.class);

    private final WebHookManager webHookManager;
    private final WebHookListener webHookListener;

    public GitlabWebhookManager(String secretToken, GitlabWebhookListener<Event> listener) {
        this.webHookManager = new WebHookManager(secretToken);
        this.webHookListener = new GitlabWebhookListenerObserver(listener);
        webHookManager.addListener(this.webHookListener);
    }

    public void onNewGitlabEvent(HttpServletRequest request) throws GitlabWebhookException {
        try {
            webHookManager.handleEvent(request);
            if (logger.isInfoEnabled()) {
                logger.info(String.format("NEW EVENT FROM %s", request.getRequestURI()));
            }
        } catch (GitLabApiException exception) {
            if (logger.isErrorEnabled()) {
                logger.error(String.format("GITLAB API EXCEPTION %s", exception.getStackTrace()));
            }
            throw new GitlabWebhookException(exception);
        }
    }

    /**
     * Removes attached listeners
     */
    public void close() {
        logger.info("CALLING CLOSE()");
        webHookManager.removeListener(webHookListener);
    }
}
