import { ThirdPartyProducerService } from './ThirdPartyProducerService';

export enum ServiceEventType {
  REDMINE_TICKET_CREATED = 'REDMINE_TICKET_CREATED',
  REDMINE_TICKET_EDITED = 'REDMINE_TICKET_EDITED',
  REDMINE_TICKET_PRIORITY_EDITED = 'REDMINE_TICKET_PRIORITY_EDITED',
  REDMINE_USER_ADDED = 'REDMINE_USER_ADDED',
  GITLAB_COMMIT_CREATED = 'GITLAB_COMMIT_CREATED',
  GITLAB_ISSUE_CREATED = 'GITLAB_ISSUE_CREATED',
  GITLAB_ISSUE_EDITED = 'GITLAB_ISSUE_EDITED',
  SONARQUBE_PROJECT_ANALYSIS_COMPLETED = 'SONARQUBE_PROJECT_ANALYSIS_COMPLETED',
}

export interface Event {
  /**
   * Time in which the event happened
   */
  timestamp: Date;

  /**
   * Third party service that originated the event
   */
  service: ThirdPartyProducerService;

  /**
   * The name of the project associated with the current event
   */
  projectName: string;

  /**
   * The URL of the project associated with the current event.
   * Sonarqube doesn't provide this information.
   */
  projectURL?: string;

  /**
   * The ID of the current event, whose representation may change based on `service`
   * and `eventType`. For instance, in Gitlab the `eventId` may be the issue ID or the
   * commit sha1, whereas in Redmine it could be the ID of the given task. In Sonarqube,
   * this would be the `taskId` of the project analysis.
   */
  eventId: string;

  /**
   * If `service` is GITLAB:
   * - GITLAB_COMMIT_CREATED
   * - GITLAB_ISSUE_CREATED
   * - GITLAB_ISSUE_EDITED
   *
   * If `service` is REDMINE:
   * - REDMINE_TICKET_CREATED
   * - REDMINE_TICKET_EDITED
   * - REDMINE_TICKET_PRIORITY_EDITED
   * - REDMINE_USER_ADDED
   *
   * If `service` is SONARQUBE:
   * - SONARQUBE_PROJECT_ANALYSIS_COMPLETED
   */
  eventType: string; // TODO: this should be an enum dependent on `service`

  /**
   * Email of the user that originated the event.
   * Sonarqube doesn't provide this information.
   */
  email?: string;

  /**
   * Title of the event. For instance, in Gitlab this would be the branch in which there was a new
   * commit, or the title of an issue. In Sonarqube this would be the status of the analysis.
   */
  title: string;

  /**
   * Description of the event. For instance, in Gitlab this would be the commit message or the
   * body of the issue. In Redmine, this could be the text of the ticket.
   */
  description: string;

  /**
   * List of tags associated with the event. For instance, in Gitlab this would be the issue labels.
   */
  tags: string[];
}
