import { flags } from '@oclif/command';
import * as inquirer from 'inquirer';
import { UserContactsRestRequests } from '../../rest-client';
import { BaseCommand, TableColumns } from '../../base/base';
import { Config } from '../../database/LocalDb';
import { Validator } from '../../utils/Validator';
import { CreateUserContact, ContactService, UserContact } from '../../rest-client/entities';

export class Create extends BaseCommand {

  static description = 'Create a new user contact';

  static flags = {
    ...BaseCommand.flags,

    account: flags.string({
      char: 'a',
      description: 'new identifier for the service specified',
      required: true,
    }),

    email: flags.string({
      char: 'e',
      description: 'user email address',
      required: true,
    }),

    platform: flags.string({
      char: 'p',
      description: '(required) choose the contact platform between SLACK, EMAIL.\
                    \nThe TELEGRAM contact can only be set from the Telegram Bot',
      options: [ContactService.EMAIL, ContactService.SLACK],
    }),
  };

  private static readonly columns: TableColumns<UserContact> = {
    userContactId: {
      header: 'Id',
      minWidth: 15,
    },
    userEmail: {
      header: 'Profile',
      minWidth: 15,
    },
    contactService: {
      header: 'Service',
      minWidth: 40,
     },
    contactRef: {
      header: 'Account',
      minWidth: 40,
    },
  };

  async run() {
    try {
      const client: UserContactsRestRequests =
        new UserContactsRestRequests(this.db.getValues(Config.Server));

      const flagss = this.parse(Create).flags;

      if (!flagss.platform) {
        const response: any = await inquirer.prompt([{
          choices: [
            { name: ContactService.EMAIL },
            { name: ContactService.SLACK },
          ],
          message: 'Select a contact platform',
          name: 'platform',
          type: 'list',
        }]);

        flagss.platform = response.platform;
      }

      if (flagss.platform === ContactService.EMAIL) {
        flagss.account = Validator.isEmailValid(flagss.account);
      }

      const newUserContact: CreateUserContact = {
        contactRef: flagss.account,
        service: ContactService[flagss.platform as ContactService],
        userEmail: Validator.isEmailValid(flagss.email),
      };

      const result = await client.create(newUserContact);
      this.showResult<UserContact>([result], Create.columns, flagss.json);

    } catch (error) {
      this.showError(error);
    }
  }
}
