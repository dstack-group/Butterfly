import { flags } from '@oclif/command';
import * as inquirer from 'inquirer';

import { SubscriptionRestRequests } from '../../rest-client';
import { BaseCommand, TableColumns } from '../../base/base';
import { Config } from '../../database/LocalDb';
import { Validator } from '../../utils/Validator';
import {
  CreateSubscription,
  ServiceEventType,
  ContactService,
  UserPriority,
  Subscription,
  Service,
} from '../../rest-client/entities';
import { CommandFlagException } from '../../exceptions';

export class Create extends BaseCommand {

  static description = 'Create a new subscription';

  static flags = {
    ...BaseCommand.flags,

    contact: flags.string({
      char: 'c',
      description: 'choose the contact service between EMAIL, SLACK, TELEGRAM where the notification will be sent',
      multiple: true,
      options: ['EMAIL', 'SLACK', 'TELEGRAM'],
      required: true,
    }),

    email: flags.string({
      char: 'e',
      description: 'user email address',
      required: true,
    }),

    'event-type': flags.string({
      char: 't',
      description: 'set the event type between ...',
    }),

    keyword: flags.string({
      char: 'k',
      description: 'keyword compared with the contents of the future events',
      multiple: true,
      required: true,
    }),

    priority: flags.string({
      char: 'P',
      description: 'set the priority between LOW, MEDIUM, HIGH',
      options: ['LOW', 'MEDIUM', 'HIGH'],
      required: true,
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
    Telegram: {
      minWidth: 10,
      get: telegram => telegram.contacts.TELEGRAM ? telegram.contacts.TELEGRAM : 'nd',
    },
    Email: {
      minWidth: 10,
      get: email => email.contacts.EMAIL ? email.contacts.EMAIL : 'nd',
    },
    Slack: {
      minWidth: 10,
      get: slack => slack.contacts.SLACK ? slack.contacts.SLACK : 'nd',
    },
    userPriority: {
      header: 'Priority',
      minWidth: 7,
    },
    keywordList: {
      header: 'Keywords',
      minWidth: 10,
    },
  };

  async run() {
    try {
      const client: SubscriptionRestRequests = new SubscriptionRestRequests(this.db.getValues(Config.Server));
      const flagss = this.parse(Create).flags;

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

      const newSubscription: CreateSubscription = {
        contactServices: flagss.contact as ContactService[],
        eventType: ServiceEventType[flagss['event-type'] as ServiceEventType],
        keywords: flagss.keyword,
        projectName: Validator.isStringValid('project', flagss.project, 0, 50),
        userEmail: Validator.isEmailValid(flagss.email),
        userPriority: UserPriority[flagss.priority as UserPriority],
      };

      const result = await client.create(newSubscription);
      this.showResult<Subscription>([result], Create.columns, flagss.json);

    } catch (error) {
      this.showError(error);
    }
  }
}
