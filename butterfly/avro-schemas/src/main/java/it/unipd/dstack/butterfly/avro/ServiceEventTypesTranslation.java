/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    avro-schemas
 * @fileName:  ServiceEventTypesTranslation.java
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 * ServiceEventTypesTranslation returns an English translation starting from a ServiceEventTypes value.
 */

package it.unipd.dstack.butterfly.avro;

import it.unipd.dstack.butterfly.producer.avro.ServiceEventTypes;

import java.util.HashMap;
import java.util.Map;

public class ServiceEventTypesTranslation {
    private final static Map<ServiceEventTypes, String> translationMap = new HashMap<>() {{
        put(ServiceEventTypes.GITLAB_COMMIT_CREATED, "Git Commit created");
        put(ServiceEventTypes.GITLAB_ISSUE_CREATED, "GitLab Issue created");
        put(ServiceEventTypes.GITLAB_ISSUE_EDITED, "GitLab Issue edited");
        put(ServiceEventTypes.GITLAB_MERGE_REQUEST_CREATED, "GitLab Merge Request created");
        put(ServiceEventTypes.GITLAB_MERGE_REQUEST_EDITED, "GitLab Merge Request edited");
        put(ServiceEventTypes.GITLAB_MERGE_REQUEST_MERGED, "GitLab Merge Request merged");
        put(ServiceEventTypes.GITLAB_MERGE_REQUEST_CLOSED, "GitLab Merge Request closed");
        put(ServiceEventTypes.REDMINE_TICKET_CREATED, "Redmine Ticket created");
        put(ServiceEventTypes.REDMINE_TICKET_EDITED, "Redmine Ticket edited");
        put(ServiceEventTypes.SONARQUBE_PROJECT_ANALYSIS_COMPLETED, "SonarQube analyisis completed");
    }};

    public static String translate(ServiceEventTypes eventType) {
        return translationMap.get(eventType);
    }
}
