package it.unipd.dstack.butterfly.producer.gitlab;

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

public class GitlabProducerControllerTest {
    private static final Logger logger = LoggerFactory.getLogger(GitlabProducerControllerTest.class);
    private final HttpClient client = HttpClient.newBuilder().build();
    private TestConfigManager configManager;

    public GitlabProducerControllerTest() {
        this.configManager = new TestConfigManager();
        this.configManager.setProperty("SERVICE_NAME", "gitlab-producer");
        this.configManager.setProperty("KAFKA_TOPIC", "service-gitlab");
        this.configManager.setProperty("SERVER_PORT", "3000");
        this.configManager.setProperty("SERVER_BASE_URL", "http://localhost");
        this.configManager.setProperty("WEBHOOK_ENDPOINT", "/webhooks/gitlab");
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
    private HttpRequest prepareRequest(String url, String gitlabToken, String gitlabEvent, String json) {
        return HttpRequest
                .newBuilder()
                .uri(URI.create(url))
                .POST(HttpRequest.BodyPublishers.ofString(json))
                .header("Content-Type", "application/json")
                .header("X-Gitlab-Token", gitlabToken)
                .header("X-Gitlab-Event", gitlabEvent)
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

    private GitlabProducerController createGitlabProducerController(Producer<Event> producer) {
        OnWebhookEventFromTopic<Event> onWebhookEventFromTopic = new OnWebhookEventFromTopicImpl<>();
        return new GitlabProducerController(this.configManager, producer, onWebhookEventFromTopic);
    }

    @Test
    public void shouldProduceAnIssueCreatedEvent() throws Exception {
        var broker = new BrokerTest<Event>();
        var originalProducer = new ProducerTest<>(broker);
        var gitlabProducerController = this.createGitlabProducerController(originalProducer);
        String kafkaTopic = configManager.getStringProperty("KAFKA_TOPIC");
        var latch = new CountDownLatch(1);

        gitlabProducerController.start();

        String issueCreatedJSON = this.readJSONFile("GITLAB_ISSUE_CREATED.json");
        String requestURL = "http://localhost:" +
                configManager.getStringProperty("SERVER_PORT") +
                configManager.getStringProperty("WEBHOOK_ENDPOINT");

        logger.info(String.format("RequestURL: %s", requestURL));
        String gitlabToken = configManager.getStringProperty("SECRET_TOKEN");
        String gitlabEvent = "Issue Hook";

        var request = this.prepareRequest(
                requestURL,
                gitlabToken,
                gitlabEvent,
                issueCreatedJSON
        );

        var response = this.sendRequest(request).thenApply((answer)->{
            List<Event> brokerData = broker.getDataByTopic(kafkaTopic);
            logger.info("broker contains: " + brokerData.get(0).toString());
            assertEquals(1, brokerData.size());
            Event brokerEvent = brokerData.get(0);
            assertEquals(Long.valueOf(1550586119000L), brokerEvent.getTimestamp());
            assertEquals(Services.GITLAB, brokerEvent.getService());
            assertEquals("Butterfly", brokerEvent.getProjectName());
            assertEquals("https://localhost:10443/dstack/butterfly", brokerEvent.getProjectURL());
            assertEquals("18373993", brokerEvent.getEventId());
            assertEquals(ServiceEventTypes.GITLAB_ISSUE_CREATED, brokerEvent.getEventType());
            assertEquals(null, brokerEvent.getUserEmail());
            assertEquals("Some bug written in VSCode by a Doge", brokerEvent.getTitle());
            assertEquals("Breaking issue that affects the Middleware Dispatcher.", brokerEvent.getDescription());
            assertEquals(2, brokerEvent.getTags().size());
            assertEquals("Doge", brokerEvent.getTags().get(0));
            assertEquals("testing", brokerEvent.getTags().get(1));
            gitlabProducerController.close();
            assertEquals(null, broker.getDataByTopic(kafkaTopic));
            return answer;
        }).get();

        // if the event is accepted by the producer it should return 200 with an empty body.
        assertEquals(200, response.statusCode());
        latch.await(1000, TimeUnit.MILLISECONDS);
        assertEquals("", response.body());
    }
}
