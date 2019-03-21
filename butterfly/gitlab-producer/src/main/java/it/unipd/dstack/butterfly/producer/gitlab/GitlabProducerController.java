package it.unipd.dstack.butterfly.producer.gitlab;

import it.unipd.dstack.butterfly.config.ConfigManager;
import it.unipd.dstack.butterfly.producer.producer.ProducerImpl;
import it.unipd.dstack.butterfly.config.record.Record;
import it.unipd.dstack.butterfly.producer.webhookhandler.WebhookHandler;
import it.unipd.dstack.butterfly.producer.avro.Event;
import it.unipd.dstack.butterfly.producer.gitlab.webhookmanager.GitlabWebhookListener;
import it.unipd.dstack.butterfly.producer.gitlab.webhookmanager.GitlabWebhookManager;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class GitlabProducerController {
    private static final Logger logger = LoggerFactory.getLogger(GitlabProducerController.class);

    private final String serviceName;
    private final String kafkaTopic;
    private final int serverPort;
    private final String secretToken;
    private GitlabWebhookListener gitlabWebhookListener;
    private GitlabWebhookManager gitlabWebhookManager;
    private ProducerImpl<Event> producer;
    private final WebhookHandler webhookHandler;

    public GitlabProducerController() {
        this.serviceName = ConfigManager.getStringProperty("SERVICE_NAME", "GitlabProducer");
        this.kafkaTopic = ConfigManager.getStringProperty("KAFKA_TOPIC");
        this.serverPort = ConfigManager.getIntProperty("SERVER_PORT");
        this.secretToken = ConfigManager.getStringProperty("SECRET_TOKEN");


        this.gitlabWebhookListener = new GitlabWebhookListenerImpl();
        this.gitlabWebhookManager = new GitlabWebhookManager(this.secretToken, this.gitlabWebhookListener);

        this.producer = new ProducerImpl<>();

        this.webhookHandler = new WebhookHandler.Builder()
                .setRoute("/webhooks/gitlab")
                .setMethod(WebhookHandler.HTTPMethod.POST)
                .setWebhookConsumer(gitlabWebhookManager::handleEvent)
                .setExceptionConsumer(e -> logger.error(serviceName, "Exception", e))
                .create();
    }

    public void start() {
        logger.info(serviceName + " started");

        webhookHandler.listen(serverPort);
        logger.info(serviceName, "Listening on port: ", serverPort);

        this.producer.awaitUntilError(this::onProducerException);
    }

    public void onProducerException(Exception e) {
        logger.error("Error: " + e);
        this.close();
    }

    public void close() {
        logger.info("CTRL+C pressed, GitlabProducerController CLOSE()");

        // removes listeners from gitlabWebhookManager
        this.gitlabWebhookManager.close();

        // terminates the production process
        this.producer.close();
    }

    private class GitlabWebhookListenerImpl implements GitlabWebhookListener {
        private void sendEvent(Event event) {
            logger.info(serviceName + " Received " + event.getEventType() + " event: " + event.toString());
            Record<Event> record = new Record<>(kafkaTopic, event);
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
