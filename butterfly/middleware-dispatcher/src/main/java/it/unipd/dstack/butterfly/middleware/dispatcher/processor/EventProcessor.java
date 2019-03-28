package it.unipd.dstack.butterfly.middleware.dispatcher.processor;

import it.unipd.dstack.butterfly.middleware.dispatcher.utils.Utils;
import it.unipd.dstack.butterfly.json.JSONConverter;
import it.unipd.dstack.butterfly.json.JSONConverterException;
import org.apache.avro.specific.SpecificRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * This class is responsible of contacting a remote REST API via an HTTP POST request.
 * It accepts json payloads, and returns the response via the asynchronous <code>processEvent</code> method.
 */
public class EventProcessor {
    private static final Logger logger = LoggerFactory.getLogger(EventProcessor.class);

    private static final int defaultEventProcessThreads = 4;
    private final JSONConverter jsonConverter;
    private final String userManagerURL;
    private final int timeoutInMs;
    private HttpClient client;
    private ExecutorService executorService;

    /**
     * Private constructor: it can only be called by <code>EventProcessor.Builder</code>.
     *
     * @param userManagerURL
     * @param threadsNumber
     * @param timeoutInMs
     * @param jsonConverter
     */
    private EventProcessor(String userManagerURL,
                           int threadsNumber,
                           int timeoutInMs,
                           JSONConverter jsonConverter) {
        this.userManagerURL = userManagerURL;
        this.executorService = Executors.newFixedThreadPool(threadsNumber);
        this.timeoutInMs = timeoutInMs;
        this.jsonConverter = jsonConverter;

        this.client = HttpClient.newBuilder()
                .executor(this.executorService)
                .build();
    }

    /**
     * Given an Avro record and a class reference, a POST request containing the record is sent to the HTTP endpoint
     * defined by userManagerURL. After receiving a response, it tries to parse it to an instance of the T type and
     * return it, leveraging its class reference. If something goes wrong,
     * Everything happens asynchronously in order not to block the IO.
     * This is the most important method of EventProcessor.
     *
     * @param avroRecord
     * @param klass      Class reference to the type.
     * @param <T>        The type of the klass instance
     * @return
     */
    public <T> CompletableFuture<T> processEvent(SpecificRecord avroRecord, Class<T> klass) {
        String json = Utils.getJSONFromAvro(avroRecord);
        var request = this.prepareRequest(json);
        return this.sendRequest(request)
                .exceptionally(ex -> {
                    logger.error("Exception in processEvent " + ex);
                    return null;
                })
                .thenApply(response -> {
                    logger.info("STATUS CODE ON RESPONSE: " + response.statusCode());
                    String responseJSON = response.body(); // return response's payload
                    try {
                        logger.info("Trying to parse UserManagerResponse");
                        T userManagerResponseFromJson =
                                this.jsonConverter.fromJson(responseJSON, klass);
                        return userManagerResponseFromJson;
                    } catch (JSONConverterException e) {
                        throw new UnprocessableEventException(e);
                    }
                });
    }

    /**
     * Prepares an HTTP POST request declaring its Content-Type header as json,
     * setting <code>this.timeoutInMs</code> as a maximum timeout and <code>this.userManagerURL</code>
     * as URL to call.
     *
     * @param json
     * @return
     */
    private HttpRequest prepareRequest(String json) {
        return HttpRequest
                .newBuilder()
                .uri(URI.create(this.userManagerURL))
                .timeout(Duration.ofMillis(this.timeoutInMs))
                .POST(HttpRequest.BodyPublishers.ofString(json))
                .header("Content-Type", "application/json")
                .build();
    }

    /**
     * Sends an HTTP request asynchronously
     *
     * @param request the request to be sent
     * @return the HTTP response wrapped in a CompletableFuture object
     */
    private CompletableFuture<HttpResponse<String>> sendRequest(HttpRequest request) {
        return this.client.sendAsync(request, HttpResponse.BodyHandlers.ofString());
    }

    /**
     * Builder pattern implementation for the EventProcessor class
     */
    static public class Builder {
        private int threadsNumber = 0;
        private String userManagerURL;
        private int timeoutInMs;
        private JSONConverter jsonConverter;

        public Builder() {
        }

        public Builder setUserManagerURL(String userManagerURL) {
            this.userManagerURL = userManagerURL;
            return this;
        }

        public Builder setThreadsNumber(int threadsNumber) {
            this.threadsNumber = threadsNumber;
            return this;
        }

        public Builder setTimeoutInMs(int timeoutInMs) {
            this.timeoutInMs = timeoutInMs;
            return this;
        }

        public Builder setJsonConverter(JSONConverter jsonConverter) {
            this.jsonConverter = jsonConverter;
            return this;
        }

        public EventProcessor build() {
            if (this.jsonConverter == null) {
                throw new NullPointerException("jsonConverter can't be null");
            }

            int eventProcessorThreads = this.threadsNumber > 0 ?
                    this.threadsNumber :
                    defaultEventProcessThreads;
            return new EventProcessor(userManagerURL, eventProcessorThreads, timeoutInMs, jsonConverter);
        }
    }
}
