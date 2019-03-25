package it.unipd.dstack.butterfly.producer.gitlab.webhookmanager;

import it.unipd.dstack.butterfly.producer.avro.Event;
import it.unipd.dstack.butterfly.producer.producer.OnWebhookEvent;
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

    public GitlabWebhookManager(String secretToken, OnWebhookEvent<Event> listener) {
        this.webHookManager = new WebHookManager(secretToken);
        this.webHookListener = new GitlabWebhookListenerAdapter(listener);
        webHookManager.addListener(this.webHookListener);
    }

    public void handleEvent(HttpServletRequest request) throws GitlabWebhookException {
        try {
            webHookManager.handleEvent(request);
            logger.info("NEW EVENT FROM " + request.getRequestURI());
        } catch (GitLabApiException exception) {
            logger.error("GITLAB API EXCEPTION " + exception.getStackTrace());
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
