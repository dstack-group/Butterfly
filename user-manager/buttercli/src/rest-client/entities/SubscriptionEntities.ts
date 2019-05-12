import { ContactService, UserContacts } from './UserContactsEntities';

export enum UserPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export enum ServiceEventType {
  REDMINE_TICKET_CREATED = 'REDMINE_TICKET_CREATED',
  REDMINE_TICKET_EDITED = 'REDMINE_TICKET_EDITED',
  GITLAB_COMMIT_CREATED = 'GITLAB_COMMIT_CREATED',
  GITLAB_ISSUE_CREATED = 'GITLAB_ISSUE_CREATED',
  GITLAB_ISSUE_EDITED = 'GITLAB_ISSUE_EDITED',
  GITLAB_MERGE_REQUEST_CREATED = 'GITLAB_MERGE_REQUEST_CREATED',
  GITLAB_MERGE_REQUEST_EDITED = 'GITLAB_MERGE_REQUEST_EDITED',
  GITLAB_MERGE_REQUEST_MERGED = 'GITLAB_MERGE_REQUEST_MERGED',
  GITLAB_MERGE_REQUEST_CLOSED = 'GITLAB_MERGE_REQUEST_CLOSED',
  SONARQUBE_PROJECT_ANALYSIS_COMPLETED = 'SONARQUBE_PROJECT_ANALYSIS_COMPLETED',
}

export interface FindSubscription {
  userEmail: string;
  eventType: ServiceEventType;
  projectName: string;
}

export interface CreateSubscription extends FindSubscription {
  contactServices: ContactService[];
  keywords: string[];
  userPriority: UserPriority;
}

export interface UpdateSubscription extends FindSubscription {
  contactServices?: ContactService[];
  keywords?: string[];
  userPriority?: UserPriority;
}

export type RemoveSubscription = FindSubscription;

export interface Subscription extends FindSubscription {
  contacts: UserContacts;
  keywordList: string[];
  userPriority: UserPriority;
}
