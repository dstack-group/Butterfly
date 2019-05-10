package it.unipd.dstack.butterfly.producer.redmine;

import it.unipd.dstack.butterfly.producer.avro.Event;
import it.unipd.dstack.butterfly.producer.avro.ServiceEventTypes;
import it.unipd.dstack.butterfly.producer.avro.Services;
import it.unipd.dstack.butterfly.producer.producer.OnWebhookEventFromTopic;
import it.unipd.dstack.butterfly.producer.producer.OnWebhookEventFromTopicImpl;
import it.unipd.dstack.butterfly.producer.producer.Producer;
import it.unipd.dstack.butterfly.producer.testutils.BrokerTest;
import it.unipd.dstack.butterfly.producer.testutils.ProducerTest;
import it.unipd.dstack.butterfly.producer.testutils.TestConfigManager;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeAll;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;

import static org.junit.Assert.assertEquals;

public class RedmineProducerControllerTest {
    private static final Logger logger = LoggerFactory.getLogger(RedmineProducerControllerTest.class);
    private final HttpClient client = HttpClient.newBuilder().build();
    private TestConfigManager configManager;

    public RedmineProducerControllerTest() {
        this.configManager = new TestConfigManager();
        this.configManager.setProperty("SERVICE_NAME", "redmine-producer");
        this.configManager.setProperty("KAFKA_TOPIC", "service-redmine");
        this.configManager.setProperty("SERVER_PORT", "4000");
        this.configManager.setProperty("SERVER_BASE_URL", "http://localhost");
        this.configManager.setProperty("WEBHOOK_ENDPOINT", "/webhooks/redmine");
        this.configManager.setProperty("PRIORITIES_TO_CONSIDER", "Alta,Urgente,Immediata");
    }

    /**
     * Prepares an HTTP POST request declaring its Content-Type header as json,
     * setting <code>this.timeoutInMs</code> as a maximum timeout and <code>this.userManagerURL</code>
     * as URL to call.
     *
     * @param json
     * @return
     */
    private HttpRequest prepareRequest(String url, String json) {
        return HttpRequest
                .newBuilder()
                .uri(URI.create(url))
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

    private String readJSONFile(String filename) throws IOException {
        String fileAsString = this.getClass()
                .getClassLoader()
                .getResource(filename)
                .getFile();
        Path filePath = Paths.get(new File(fileAsString).getAbsolutePath());
        return Files.readString(filePath);
    }

    private RedmineProducerController createRedmineProducerController(Producer<Event> producer) {
        OnWebhookEventFromTopic<Event> onWebhookEventFromTopic = new OnWebhookEventFromTopicImpl<>();
        return new RedmineProducerController(this.configManager, producer, onWebhookEventFromTopic);
    }

    @Test
    public void shouldProduceATickedCreatedEvent() throws Exception {
        var broker = new BrokerTest<Event>();
        var originalProducer = new ProducerTest<>(broker);
        var redmineProducerController = this.createRedmineProducerController(originalProducer);
        String kafkaTopic = configManager.getStringProperty("KAFKA_TOPIC");
        var latch = new CountDownLatch(1);

        redmineProducerController.start();

        String issueCreatedJSON = this.readJSONFile("REDMINE_TICKET_CREATED.json");
        String requestURL = "http://localhost:" +
                configManager.getStringProperty("SERVER_PORT") +
                configManager.getStringProperty("WEBHOOK_ENDPOINT");

        var request = this.prepareRequest(
                requestURL,
                issueCreatedJSON
        );

        var response = this.sendRequest(request).thenApply((answer)->{
            List<Event> brokerData = broker.getDataByTopic(kafkaTopic);
            logger.info("broker contains: " + brokerData.get(0).toString());
            assertEquals(1, brokerData.size());
            Event brokerEvent = brokerData.get(0);
            assertEquals(Long.valueOf(1553611940643L), brokerEvent.getTimestamp());
            assertEquals(ServiceEventTypes.REDMINE_TICKET_CREATED, brokerEvent.getEventType());
            assertEquals(Services.REDMINE, brokerEvent.getService());
            assertEquals("New bug created by Doge", brokerEvent.getTitle());
            assertEquals("A doge has to fix a new bug that affects the User Manager", brokerEvent.getDescription());
            assertEquals("2", brokerEvent.getEventId());
            assertEquals("Butterfly", brokerEvent.getProjectName());
            assertEquals("http://redmine.dstackgroup.com/butterfly/butterfly", brokerEvent.getProjectURL());
            assertEquals(List.of("Bug"), brokerEvent.getTags());
            assertEquals("admin@example.net", brokerEvent.getUserEmail());
            assertEquals("admin", brokerEvent.getUsername());
            logger.info("Assertions passed..");
            redmineProducerController.close();
            assertEquals(null, broker.getDataByTopic(kafkaTopic));
            return answer;
        }).get();

        // if the event is accepted by the producer it should return 200 with an empty body.
        assertEquals(200, response.statusCode());
        latch.await(1000, TimeUnit.MILLISECONDS);
        assertEquals("", response.body());
    }
}
