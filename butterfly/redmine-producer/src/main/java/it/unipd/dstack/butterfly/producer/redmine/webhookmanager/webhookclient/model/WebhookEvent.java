package it.unipd.dstack.butterfly.producer.redmine.webhookmanager.webhookclient.model;

public class WebhookEvent {
    private String eventKind;

    public void setEventKind(String objectKind) {
        this.eventKind = objectKind;
    }

    public String getEventKind() {
        return eventKind;
    }
}
