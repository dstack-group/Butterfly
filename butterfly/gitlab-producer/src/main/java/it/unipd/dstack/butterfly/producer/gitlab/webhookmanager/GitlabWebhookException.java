/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    gitlab-producer
 * @fileName:  GitlabWebhookException.java
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

package it.unipd.dstack.butterfly.producer.gitlab.webhookmanager;

        import org.gitlab4j.api.GitLabApiException;

public class GitlabWebhookException extends RuntimeException {
    public GitlabWebhookException(GitLabApiException exception) {
        super(exception.getMessage());
    }
}
