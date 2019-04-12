package it.unipd.dstack.butterfly.producer.redmine.webhookmanager;

import it.unipd.dstack.butterfly.producer.avro.Event;
import it.unipd.dstack.butterfly.producer.redmine.webhookmanager.webhookclient.RedmineWebhookClient;
import it.unipd.dstack.butterfly.producer.redmine.webhookmanager.webhookclient.WebhookListener;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.http.HttpServletRequest;

public class RedmineWebhookManager {
    private static final Logger logger = LoggerFactory.getLogger(RedmineWebhookManager.class);

    private final RedmineWebhookClient webHookManager;
    private final WebhookListener webHookListener;

    public RedmineWebhookManager(RedmineWebhookListener<Event> listener) {
        webHookManager = new RedmineWebhookClient();
        this.webHookListener = new RedmineWebhookListenerObserver(listener);
        webHookManager.addListener(this.webHookListener);
    }

    public void onNewRedmineEvent(HttpServletRequest request) throws RedmineWebhookException {
        try {
            webHookManager.handleEvent(request);
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
        logger.info("CALLING CLOSE()");
        webHookManager.removeListener(this.webHookListener);
    }
}
