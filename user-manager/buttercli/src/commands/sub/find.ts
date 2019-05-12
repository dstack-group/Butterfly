import { flags } from '@oclif/command';
import * as inquirer from 'inquirer';

import { SubscriptionRestRequests } from '../../rest-client';
import { BaseCommand, TableColumns } from '../../base/base';
import { Config } from '../../database/LocalDb';
import { Validator } from '../../utils/Validator';
import { FindSubscription, ServiceEventType, Subscription } from '../../rest-client/entities';

export class Find extends BaseCommand {

  static description = 'Find an existing subscription';

  static flags = {
    ...BaseCommand.flags,

    email: flags.string({
      char: 'e',
      description: 'user email address',
      required: true,
    }),

    projectName: flags.string({
      char: 'p',
      description: 'project name',
      required: true,
    }),

    gitlab_commit_created: flags.boolean({
      description: 'set event: GITLAB_COMMIT_CREATED',
      parse: input => ServiceEventType.GITLAB_COMMIT_CREATED,
    }),

    gitlab_issue_created: flags.boolean({
      description: 'set event: GITLAB_ISSUE_CREATED',
      parse: input => ServiceEventType.GITLAB_ISSUE_CREATED,
    }),

    gitlab_issue_edited: flags.boolean({
      description: 'set event: GITLAB_ISSUE_EDITED',
      parse: input => ServiceEventType.GITLAB_ISSUE_EDITED,
    }),

    gitlab_merge_request_created: flags.boolean({
      description: 'set event: GITLAB_MERGE_REQUEST_CREATED',
      parse: input => ServiceEventType.GITLAB_MERGE_REQUEST_CREATED,
    }),

    gitlab_merge_request_edited: flags.boolean({
      description: 'set event: GITLAB_MERGE_REQUEST_EDITED',
      parse: input => ServiceEventType.GITLAB_MERGE_REQUEST_EDITED,
    }),

    gitlab_merge_request_merged: flags.boolean({
      description: 'set event: GITLAB_MERGE_REQUEST_MERGED',
      parse: input => ServiceEventType.GITLAB_MERGE_REQUEST_MERGED,
    }),

    gitlab_merge_request_closed: flags.boolean({
      description: 'set event: GITLAB_MERGE_REQUEST_CLOSED',
      parse: input => ServiceEventType.GITLAB_MERGE_REQUEST_CLOSED,
    }),

    redmine_ticket_created: flags.boolean({
      description: 'set event: REDMINE_TICKET_CREATED',
      parse: input => ServiceEventType.REDMINE_TICKET_CREATED,
    }),

    redmine_ticket_edited: flags.boolean({
      description: 'set event: REDMINE_TICKET_EDITED',
      parse: input => ServiceEventType.REDMINE_TICKET_EDITED,
    }),

    sonarqube_project_analysis_completed: flags.boolean({
      description: 'set event: SONARQUBE_PROJECT_ANALYSIS_COMPLETED',
      parse: input => ServiceEventType.SONARQUBE_PROJECT_ANALYSIS_COMPLETED,
    }),
  };

  private static readonly columns: TableColumns<Subscription> = {
    Email: {
      get: email => email.contacts.EMAIL ? email.contacts.EMAIL : 'nd',
      minWidth: 10,
    },
    Slack: {
      get: slack => slack.contacts.SLACK ? slack.contacts.SLACK : 'nd',
      minWidth: 10,
    },
    Telegram: {
      get: telegram => telegram.contacts.TELEGRAM ?  telegram.contacts.TELEGRAM : 'nd',
      minWidth: 10,
    },
    eventType: {
      header: 'Event',
      minWidth: 15,
    },
    keywordList: {
      header: 'Keywords',
      minWidth: 10,
    },
    projectName: {
      header: 'Project name',
      minWidth: 15,
    },
    subscriptionId: {
      header: 'ID',
      minWidth: 10,
    },
    userEmail: {
      header: 'User email',
      minWidth: 15,
    },
    userPriority: {
      header: 'Priority',
      minWidth: 7,
    },
  };

  async run() {
    try {
      const client: SubscriptionRestRequests = new SubscriptionRestRequests(this.db.getValues(Config.Server));
      const flagss = this.parse(Find).flags;

      let eventTypeSelected = ServiceEventType.GITLAB_COMMIT_CREATED;

      if (flagss.gitlab_commit_created !== undefined) {
        eventTypeSelected = flagss.gitlab_commit_created;

      } else if (flagss.gitlab_issue_created) {
        eventTypeSelected = flagss.gitlab_issue_created;

      } else if (flagss.gitlab_issue_edited) {
        eventTypeSelected = flagss.gitlab_issue_edited;

      } else if (flagss.gitlab_merge_request_created) {
        eventTypeSelected = flagss.gitlab_merge_request_created;

      } else if (flagss.gitlab_merge_request_edited) {
        eventTypeSelected = flagss.gitlab_merge_request_edited;

      } else if (flagss.gitlab_merge_request_merged) {
        eventTypeSelected = flagss.gitlab_merge_request_merged;

      } else if (flagss.gitlab_merge_request_closed) {
        eventTypeSelected = flagss.gitlab_merge_request_closed;

      } else if (flagss.redmine_ticket_created) {
        eventTypeSelected = flagss.redmine_ticket_created;

      } else if (flagss.redmine_ticket_edited) {
        eventTypeSelected = flagss.redmine_ticket_edited;

      } else if (flagss.sonarqube_project_analysis_completed) {
        eventTypeSelected = flagss.sonarqube_project_analysis_completed;

      } else {
        const response: any = await inquirer.prompt([{
          choices: [
            {name: ServiceEventType.GITLAB_COMMIT_CREATED},
            {name: ServiceEventType.GITLAB_ISSUE_CREATED},
            {name: ServiceEventType.GITLAB_ISSUE_EDITED},
            {name: ServiceEventType.GITLAB_MERGE_REQUEST_CLOSED},
            {name: ServiceEventType.GITLAB_MERGE_REQUEST_CREATED},
            {name: ServiceEventType.GITLAB_MERGE_REQUEST_EDITED},
            {name: ServiceEventType.GITLAB_MERGE_REQUEST_MERGED},
            new inquirer.Separator(),
            {name: ServiceEventType.REDMINE_TICKET_CREATED},
            {name: ServiceEventType.REDMINE_TICKET_EDITED},
            new inquirer.Separator(),
            {name: ServiceEventType.SONARQUBE_PROJECT_ANALYSIS_COMPLETED},
            new inquirer.Separator(),
          ],
          message: 'Select an event',
          name: 'event',
          type: 'list',
        }]);

        eventTypeSelected = response.event;
      }

      const subscription: FindSubscription = {
        eventType: eventTypeSelected,
        projectName: Validator.isStringValid('projectName', flagss.projectName, 0, 50),
        userEmail: Validator.isEmailValid(flagss.email),
      };

      const result = await client.find(subscription);
      this.showResult<Subscription>([result], Find.columns, flagss.json);

    } catch (error) {
      this.showError(error);
    }
  }
}
