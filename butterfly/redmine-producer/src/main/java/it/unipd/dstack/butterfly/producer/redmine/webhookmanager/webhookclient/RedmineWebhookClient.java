package it.unipd.dstack.butterfly.producer.redmine.webhookmanager.webhookclient;

import it.unipd.dstack.butterfly.json.JSONConverter;
import it.unipd.dstack.butterfly.json.JSONConverterImpl;
import it.unipd.dstack.butterfly.producer.redmine.webhookmanager.RedmineWebhookException;
import it.unipd.dstack.butterfly.producer.redmine.webhookmanager.webhookclient.model.*;
import it.unipd.dstack.butterfly.producer.redmine.webhookmanager.webhookclient.utils.HttpRequestUtils;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

public class RedmineWebhookClient {
    private final List<WebhookListener> webhookListeners = new CopyOnWriteArrayList<WebhookListener>();

    public static final JSONConverter jsonConverter = new JSONConverterImpl();

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
            List<PayloadAction> payloadActionList = jsonConverter.fromJsonArray(postData, PayloadAction.class);

            var action = payloadActionList.get(0).getPayload().getAction();

            WebhookEvent event = null;

            /**
             * Unfortunately the plugin redmine_webhook doesn't provide the type of event in a
             * HTTP header, so a first JSON deserialization is needed in order to determine the
             * even type of the current HTTP request.
             */
            if (action == "opened") {
                event = jsonConverter.fromJson(postData, IssueCreatedEvent.class);
                event.setEventKind(IssueCreatedEvent.eventKind);
            } else if (action == "updated") {
                event = jsonConverter.fromJson(postData, IssueEditedEvent.class);
                event.setEventKind(IssueEditedEvent.EventKind);
            } else {
                throw new RedmineWebhookException();
            }

            this.fireEvent(event);

        } catch (IOException e) {
            throw new RedmineWebhookException();
        }
    }

    private void fireEvent(WebhookEvent event) {
        switch (event.getEventKind()) {
            case IssueCreatedEvent.eventKind:
                this.fireIssueCreatedEvent((IssueCreatedEvent) event);
                break;
            case IssueEditedEvent.EventKind:
                this.fireIssueEditedEvent((IssueEditedEvent) event);
                break;
            default:
                throw new RedmineWebhookException();
        }
    }

    private void fireIssueCreatedEvent(IssueCreatedEvent event) {
        webhookListeners.forEach(listener -> listener.onIssueCreatedEvent(event));
    }

    private void fireIssueEditedEvent(IssueEditedEvent event) {
        webhookListeners.forEach(listener -> listener.onIssueEditedEvent(event));
    }
}
