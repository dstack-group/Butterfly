package it.unipd.dstack.butterfly.producer.webhookhandler;

import spark.Request;
import spark.Response;
import spark.Spark;

import javax.servlet.http.HttpServletRequest;
import java.util.function.Consumer;

public class WebhookHandler {
    private final String route;
    private final HTTPMethod method;
    private final Consumer<Exception> exceptionConsumer;
    private final Consumer<HttpServletRequest> webhookConsumer;

    private WebhookHandler(String route,
                           HTTPMethod method,
                           Consumer<Exception> exceptionConsumer,
                           Consumer<HttpServletRequest> webhookConsumer) {
        this.route = route;
        this.method = method;
        this.exceptionConsumer = exceptionConsumer;
        this.webhookConsumer = webhookConsumer;

        Spark.initExceptionHandler(exceptionConsumer);
    }

    public synchronized void listen(int port) {
        Spark.port(port);
        attachWebhookHandlerToMethod();
    }

    public String getRoute() {
        return route;
    }

    public HTTPMethod getMethod() {
        return method;
    }

    private String handleWebhook(Request request, Response response) {
        webhookConsumer.accept(request.raw());
        response.status(200);
        return "";
    }

    private void attachWebhookHandlerToMethod() {
        switch (method) {
            case GET:
                Spark.get(route, this::handleWebhook);
                break;
            case POST:
                Spark.post(route, this::handleWebhook);
                break;
            default:
                // impossible to reach this block
        }
    }

    public enum HTTPMethod {
        GET,
        POST,
    }

    public static class Builder {
        private String route = "/";
        private HTTPMethod method = HTTPMethod.POST;
        private Consumer<Exception> exceptionConsumer = (e) -> {
        };

        private Consumer<HttpServletRequest> webhookConsumer;

        public Builder setRoute(String route) {
            this.route = route;
            return this;
        }

        public Builder setMethod(HTTPMethod method) {
            this.method = method;
            return this;
        }

        public Builder setExceptionConsumer(Consumer<Exception> exceptionConsumer) {
            this.exceptionConsumer = exceptionConsumer;
            return this;
        }

        public Builder setWebhookConsumer(Consumer<HttpServletRequest> webhookConsumer) {
            this.webhookConsumer = webhookConsumer;
            return this;
        }

        public WebhookHandler create() {
            if (webhookConsumer == null) {
                throw new NullPointerException("webhookConsumer must be defined");
            }

            return new WebhookHandler(route, method, exceptionConsumer, webhookConsumer);
        }
    }
}
