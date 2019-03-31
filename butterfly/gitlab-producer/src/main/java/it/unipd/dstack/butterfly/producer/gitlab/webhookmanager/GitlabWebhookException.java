package it.unipd.dstack.butterfly.producer.gitlab.webhookmanager;

        import org.gitlab4j.api.GitLabApiException;

public class GitlabWebhookException extends RuntimeException {
    public GitlabWebhookException(GitLabApiException exception) {
        super(exception.getMessage());
    }
}
