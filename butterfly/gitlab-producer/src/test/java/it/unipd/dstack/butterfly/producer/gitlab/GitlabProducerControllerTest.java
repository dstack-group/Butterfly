package it.unipd.dstack.butterfly.producer.gitlab;

import io.confluent.common.utils.TestUtils;
import it.unipd.dstack.butterfly.controller.record.Record;
import it.unipd.dstack.butterfly.producer.avro.ServiceEventTypes;
import it.unipd.dstack.butterfly.producer.avro.Services;
import it.unipd.dstack.butterfly.producer.gitlab.testutils.BrokerTest;
import it.unipd.dstack.butterfly.producer.gitlab.testutils.ProducerTest;
import it.unipd.dstack.butterfly.producer.gitlab.testutils.TestConfigManager;
import it.unipd.dstack.butterfly.producer.gitlab.webhookmanager.GitlabWebhookManager;
import it.unipd.dstack.butterfly.producer.producer.OnWebhookEventFromTopic;
import it.unipd.dstack.butterfly.producer.producer.OnWebhookEventFromTopicImpl;
import it.unipd.dstack.butterfly.producer.producer.Producer;
import it.unipd.dstack.butterfly.producer.avro.Event;

import org.I0Itec.zkclient.ZkClient;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.mockito.stubbing.Answer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import spark.Spark;

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
import java.util.logging.ConsoleHandler;
import java.util.logging.Handler;
import java.util.logging.Level;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.spy;

public class GitlabProducerControllerTest {
    private static final Logger logger = LoggerFactory.getLogger(GitlabProducerControllerTest.class);
    private final HttpClient client = HttpClient.newBuilder()
            .build();
    private static TestConfigManager configManager;

    @BeforeAll
    public static void initConfigManager() {
        configManager = new TestConfigManager();
        configManager.setProperty("SERVICE_NAME", "gitlab-producer");
        configManager.setProperty("KAFKA_TOPIC", "service-gitlab");
        configManager.setProperty("SERVER_PORT", "3000");
        configManager.setProperty("SERVER_BASE_URL", "http://localhost");
        configManager.setProperty("WEBHOOK_ENDPOINT", "/webhooks/gitlab");
        configManager.setProperty("SECRET_TOKEN", "super-secret-token");



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
       /*
        logger.info("url: " + url);
        logger.info("gitlab token: " + gitlabToken);
        logger.info("gitlab event: " + gitlabEvent);
        logger.info("json: " + json);
        */
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
        return new GitlabProducerController(configManager, producer, onWebhookEventFromTopic);
    }

    @Test
    public void shouldProduceAnIssueCreatedEvent() throws Exception {
        var broker = new BrokerTest<Event>();
        var originalProducer = new ProducerTest<>(broker);
        var producer = spy(originalProducer);
        var gitlabProducerController = this.createGitlabProducerController(originalProducer);
        String kafkaTopic = configManager.getStringProperty("KAFKA_TOPIC");
        var latch = new CountDownLatch(1);

        doAnswer((Answer<Void>) invocation -> {
            // a single event should have been published to the broker, and its content should match the content
            // of GITLAB_ISSUE_CREATED.json

            List<Event> brokerData = broker.getDataByTopic(kafkaTopic);

            logger.info("BROKER DATA: " + brokerData.get(0).toString());
            assertEquals(1, brokerData.size());

            Event brokerEvent = brokerData.get(0);
            assertEquals(Long.valueOf(1550586119000L), brokerEvent.getTimestamp());
            assertEquals(Services.GITLAB, brokerEvent.getService());
            assertEquals("Butterfly", brokerEvent.getProjectName());
            assertEquals("https://localhost:10443/dstack/butterfly", brokerEvent.getProjectURL());
            assertEquals("10560918", brokerEvent.getEventId());
            assertEquals(ServiceEventTypes.GITLAB_ISSUE_CREATED, brokerEvent.getEventType());
            assertEquals(null, brokerEvent.getUserEmail());
            assertEquals("Butterfly", brokerEvent.getTitle());
            assertEquals("", brokerEvent.getDescription());

            assertEquals(2, brokerEvent.getTags().size());
            assertEquals("Doge", brokerEvent.getTags().get(0));
            assertEquals("testing", brokerEvent.getTags().get(1));

            assertEquals(false, true);
            gitlabProducerController.close();

            assertEquals(null, broker.getDataByTopic(kafkaTopic));
            return null;
        }).when(producer)
                .send(any(Record.class));

        gitlabProducerController.start();




        String issueCreatedJSON = this.readJSONFile("GITLAB_ISSUE_CREATED.json");
        String requestURL = "http://localhost:" +
                configManager.getStringProperty("SERVER_PORT") +
                configManager.getStringProperty("WEBHOOK_ENDPOINT");
        String gitlabToken = configManager.getStringProperty("SECRET_TOKEN");
        String gitlabEvent = "Issue Hook";

        var request = this.prepareRequest(
                requestURL,
                gitlabToken,
                gitlabEvent,
                issueCreatedJSON
        );

        var response = this.sendRequest(request).get();

        // if the event is accepted by the producer it should return 200 with an empty body.
        assertEquals(200, response.statusCode());

        latch.await(1000, TimeUnit.MILLISECONDS);
        assertEquals("", response.body());
    }
}
