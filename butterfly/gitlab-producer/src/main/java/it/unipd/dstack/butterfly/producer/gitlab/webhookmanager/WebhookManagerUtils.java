package it.unipd.dstack.butterfly.producer.gitlab.webhookmanager;

class WebhookManagerUtils {
    private WebhookManagerUtils() {}

    static <T extends Number> String numberToString(T number) {
        return String.valueOf(number);
    }
}
