import { flags } from '@oclif/command';
import * as inquirer from 'inquirer';

import { SubscriptionRestRequests } from '../../rest-client';
import { BaseCommand, TableColumns } from '../../base/base';
import { Config } from '../../database/LocalDb';
import { Validator } from '../../utils/Validator';
import {
  FindSubscription,
  ServiceEventType,
  Subscription,
} from '../../rest-client/entities';

export class Find extends BaseCommand {

  static description = 'Find an existing subscription';

  static flags = {
    ...BaseCommand.flags,

    email: flags.string({
      char: 'e',
      description: 'user email address',
      required: true,
    }),

    'event-type': flags.string({
      char: 't',
      description: '(required) set the event type between\nGITLAB_COMMIT_CREATED\
                    \nGITLAB_ISSUE_CREATED\nGITLAB_ISSUE_EDITED\nGITLAB_MERGE_REQUEST_CREATED\
                    \nGITLAB_MERGE_REQUEST_EDITED\nGITLAB_MERGE_REQUEST_MERGED\
                    \nGITLAB_MERGE_REQUEST_CLOSED\nREDMINE_TICKET_CREATED\
                    \nREDMINE_TICKET_EDITED\nSONARQUBE_PROJECT_ANALYSIS_COMPLETED',
    }),

    project: flags.string({
      char: 'p',
      description: 'project name',
      required: true,
    }),
  };

  private static readonly columns: TableColumns<Subscription> = {
    subscriptionId: {
      header: 'Id',
      minWidth: 10,
    },
    userEmail: {
      header: 'User email',
      minWidth: 15,
    },
    projectName: {
      header: 'Project name',
      minWidth: 15,
    },
    eventType: {
      header: 'Event',
      minWidth: 15,
    },
    Email: {
      minWidth: 10,
      get: email => email.contacts.EMAIL ? email.contacts.EMAIL : 'nd',
    },
    Slack: {
      minWidth: 10,
      get: slack => slack.contacts.SLACK ? slack.contacts.SLACK : 'nd',
    },
    Telegram: {
      minWidth: 10,
      get: telegram => telegram.contacts.TELEGRAM ? telegram.contacts.TELEGRAM : 'nd',
    },
    userPriority: {
      header: 'Priority',
      minWidth: 7,
    },
    keywords: {
      header: 'Keywords',
      minWidth: 10,
    },
  };

  async run() {
    try {
      const client: SubscriptionRestRequests = new SubscriptionRestRequests(this.db.getValues(Config.Server));
      const flagss = this.parse(Find).flags;

      if (!flagss['event-type'] || !(flagss['event-type'] in ServiceEventType)) {
        const response: any = await inquirer.prompt([{
          choices: [
            { name: ServiceEventType.GITLAB_COMMIT_CREATED },
            { name: ServiceEventType.GITLAB_ISSUE_CREATED },
            { name: ServiceEventType.GITLAB_ISSUE_EDITED },
            { name: ServiceEventType.GITLAB_MERGE_REQUEST_CLOSED },
            { name: ServiceEventType.GITLAB_MERGE_REQUEST_CREATED },
            { name: ServiceEventType.GITLAB_MERGE_REQUEST_EDITED },
            { name: ServiceEventType.GITLAB_MERGE_REQUEST_MERGED },
            new inquirer.Separator(),
            { name: ServiceEventType.REDMINE_TICKET_CREATED },
            { name: ServiceEventType.REDMINE_TICKET_EDITED },
            new inquirer.Separator(),
            { name: ServiceEventType.SONARQUBE_PROJECT_ANALYSIS_COMPLETED },
            new inquirer.Separator(),
          ],
          message: 'Select an event',
          name: 'event',
          type: 'list',
        }]);

        flagss['event-type'] = response.event;
      }

      const subscription: FindSubscription = {
        eventType: ServiceEventType[flagss['event-type'] as ServiceEventType],
        projectName: Validator.isStringValid('projectName', flagss.project, 0, 50),
        userEmail: Validator.isEmailValid(flagss.email),
      };

      const result = await client.find(subscription);
      this.showResult<Subscription>([result], Find.columns, flagss.json);

    } catch (error) {
      this.showError(error);
    }
  }
}
