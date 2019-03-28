package it.unipd.dstack.butterfly.producer.redmine.webhookmanager;

import it.unipd.dstack.butterfly.producer.avro.Event;
import it.unipd.dstack.butterfly.producer.producer.OnWebhookEvent;
import it.unipd.dstack.butterfly.producer.redmine.webhookmanager.webhookclient.RedmineWebhookClient;
import it.unipd.dstack.butterfly.producer.redmine.webhookmanager.webhookclient.WebhookListener;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.http.HttpServletRequest;

public class RedmineWebhookManager {
    private static final Logger logger = LoggerFactory.getLogger(RedmineWebhookManager.class);

    private final RedmineWebhookClient webHookManager;
    // private final WebhookListener webHookListener;

    public RedmineWebhookManager(OnWebhookEvent<Event> listener) {
        webHookManager = new RedmineWebhookClient();
        // webHookManager.addListener(this.webHookListener);
    }

    public void handleEvent(HttpServletRequest request) throws RedmineWebhookException {

    }

    /**
     * Removes attached listeners
     */
    public void close() {
        logger.info("CALLING CLOSE()");
        // webHookManager.removeListener(this.webHookListener);
    }
}
