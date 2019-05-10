package it.unipd.dstack.butterfly.producer.sonarqube;

import it.unipd.dstack.butterfly.producer.avro.ServiceEventTypes;
import it.unipd.dstack.butterfly.producer.avro.Services;
import it.unipd.dstack.butterfly.producer.avro.Event;
import it.unipd.dstack.butterfly.producer.producer.OnWebhookEventFromTopic;
import it.unipd.dstack.butterfly.producer.producer.OnWebhookEventFromTopicImpl;
import it.unipd.dstack.butterfly.producer.producer.Producer;
import it.unipd.dstack.butterfly.producer.testutils.BrokerTest;
import it.unipd.dstack.butterfly.producer.testutils.ProducerTest;
import it.unipd.dstack.butterfly.producer.testutils.TestConfigManager;

import org.junit.jupiter.api.Test;
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

import static org.junit.jupiter.api.Assertions.assertEquals;

public class SonarqubeProducerControllerTest {
    private static final Logger logger = LoggerFactory.getLogger(SonarqubeProducerControllerTest.class);
    private final HttpClient client = HttpClient.newBuilder().build();
    private TestConfigManager configManager;

    public SonarqubeProducerControllerTest() {
        this.configManager = new TestConfigManager();
        this.configManager.setProperty("SERVICE_NAME", "sonarqube-producer");
        this.configManager.setProperty("KAFKA_TOPIC", "service-sonarqube");
        this.configManager.setProperty("SERVER_PORT", "3000");
        this.configManager.setProperty("SERVER_BASE_URL", "http://localhost");
        this.configManager.setProperty("WEBHOOK_ENDPOINT", "/webhooks/sonarqube");
        this.configManager.setProperty("SECRET_TOKEN", "super-secret-token");
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

    private SonarqubeProducerController createSonarqubeProducerController(Producer<Event> producer) {
        OnWebhookEventFromTopic<Event> onWebhookEventFromTopic = new OnWebhookEventFromTopicImpl<>();
        return new SonarqubeProducerController(this.configManager, producer, onWebhookEventFromTopic);
    }

    @Test
    public void shouldProduceAnEvent() throws Exception {
        var broker = new BrokerTest<Event>();
        var originalProducer = new ProducerTest<>(broker);
        var sonarqubeProducerController = this.createSonarqubeProducerController(originalProducer);
        String kafkaTopic = configManager.getStringProperty("KAFKA_TOPIC");
        var latch = new CountDownLatch(1);

        sonarqubeProducerController.start();

        String issueCreatedJSON = this.readJSONFile("SONARQUBE_PROJECT_ANALYSIS_COMPLETED.json");
        String requestURL = "http://localhost:" +
                configManager.getStringProperty("SERVER_PORT") +
                configManager.getStringProperty("WEBHOOK_ENDPOINT");

        logger.info(String.format("RequestURL: %s", requestURL));

        var request = this.prepareRequest(
                requestURL,
                issueCreatedJSON
        );

        var response = this.sendRequest(request).thenApply((answer)->{
            List<Event> brokerData = broker.getDataByTopic(kafkaTopic);
            logger.info("broker contains: " + brokerData.get(0).toString());
            assertEquals(1, brokerData.size());
            Event brokerEvent = brokerData.get(0);
            assertEquals(Long.valueOf(1556058757000L), brokerEvent.getTimestamp());
            assertEquals(Services.SONARQUBE, brokerEvent.getService());
            assertEquals("Butterfly", brokerEvent.getProjectName());
            assertEquals("http://localhost:9000/dashboard?id=it.unipd.dstack.butterfly%3Abutterfly", brokerEvent.getProjectURL());
            assertEquals("AWpMVIXi300Bl9GYiThJ", brokerEvent.getEventId());
            assertEquals(ServiceEventTypes.SONARQUBE_PROJECT_ANALYSIS_COMPLETED, brokerEvent.getEventType());
            assertEquals(null, brokerEvent.getUserEmail());
            assertEquals("SUCCESS", brokerEvent.getTitle());
            assertEquals("new_maintainability_rating: OK new_coverage: ERROR new_duplicated_lines_density: OK new_security_rating: OK new_reliability_rating: OK ",
                    brokerEvent.getDescription());
            assertEquals(0, brokerEvent.getTags().size());
            sonarqubeProducerController.close();
            assertEquals(null, broker.getDataByTopic(kafkaTopic));
            return answer;
        }).get();

        // if the event is accepted by the producer it should return 200 with an empty body.
        assertEquals(200, response.statusCode());
        latch.await(1000, TimeUnit.MILLISECONDS);
        assertEquals("", response.body());
    }
}
