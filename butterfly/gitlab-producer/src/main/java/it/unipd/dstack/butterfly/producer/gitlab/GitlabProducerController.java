package it.unipd.dstack.butterfly.producer.gitlab;

import it.unipd.dstack.butterfly.config.ConfigManager;
import it.unipd.dstack.butterfly.producer.webhookhandler.WebhookHandler;
import it.unipd.dstack.butterfly.producer.avro.Event;
import it.unipd.dstack.butterfly.producer.gitlab.webhookmanager.GitlabWebhookListener;
import it.unipd.dstack.butterfly.producer.gitlab.webhookmanager.GitlabWebhookManager;
import it.unipd.dstack.butterfly.producer.producer.Producer;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.concurrent.CountDownLatch;

public class GitlabProducerController {
    private static final Logger logger = LoggerFactory.getLogger(GitlabProducerController.class);

    private final String serviceName;
    private final String kafkaTopic;
    private final int serverPort;
    private final String secretToken;
    private GitlabWebhookListener gitlabWebhookListener;
    private GitlabWebhookManager gitlabWebhookManager;
    private Producer<String, Event> producer;
    private CountDownLatch latch = new CountDownLatch(1);

    public GitlabProducerController() {
        this.serviceName = ConfigManager.getStringProperty("SERVICE_NAME", "GitlabProducer");
        this.kafkaTopic = ConfigManager.getStringProperty("KAFKA_TOPIC");
        this.serverPort = ConfigManager.getIntProperty("SERVER_PORT");
        this.secretToken = ConfigManager.getStringProperty("SECRET_TOKEN");
    }

    public void start() {
        logger.info(serviceName, "Service started");
        this.producer = new Producer<>();
        this.gitlabWebhookListener = new GitlabWebhookListenerImpl();
        this.gitlabWebhookManager = new GitlabWebhookManager(this.secretToken, this.gitlabWebhookListener);

        WebhookHandler webhookHandler = new WebhookHandler.Builder()
                .setRoute("/webhooks/gitlab")
                .setMethod(WebhookHandler.HTTPMethod.POST)
                .setWebhookConsumer(gitlabWebhookManager::handleEvent)
                .setExceptionConsumer(e -> logger.error(serviceName, "Exception", e))
                .create();

        webhookHandler.listen(serverPort);
        logger.info(serviceName, "Listening on port: ", serverPort);

        try {
            logger.info("Awaiting on latch");
            this.latch.await();
        } catch (InterruptedException e) {
            logger.error("InterruptingException error: " + e);
        } catch (RuntimeException e) {
            logger.error("RuntimeException error: " + e);
        } finally {
            this.close();
        }
    }

    public void close() {
        logger.info("CTRL+C pressed, GitlabProducerController CLOSE()");

        // if the current count equals 0, nothing happens
        this.latch.countDown();

        // removes listeners from gitlabWebhookManager
        this.gitlabWebhookManager.close();

        // terminates the production process
        this.producer.close();
    }

    private class GitlabWebhookListenerImpl implements GitlabWebhookListener {
        private void sendEvent(Event event) {
            logger.info(serviceName + " Received " + event.getEventType() + " event: " + event.toString());
            ProducerRecord<String, Event> record = new ProducerRecord<>(kafkaTopic, event);
            GitlabProducerController.this.producer.send(record);
        }

        /**
         * This method is called when a WebHook merge request event has been received.
         * Not currently supported
         *
         * @param event the EventObject instance containing info on the merge request
         */
        /*
        @Override
        public void handleMergeRequestEvent(Event event) {
            this.sendEvent(event);
        }
        */

        /**
         * This method is called when a WebHook push event has been received.
         *
         * @param event the PushEvent instance
         */
        @Override
        public void handlePushEvent(Event event) {
            this.sendEvent(event);
        }

        /**
         * This method is called when a WebHook issue event has been received.
         *
         * @param event the Event instance containing info about the issue event
         */
        @Override
        public void handleIssueEvent(Event event) {
            this.sendEvent(event);
        }
    }
}
