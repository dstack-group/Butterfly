import { flags } from '@oclif/command';
import * as inquirer from 'inquirer';
import { UserContactsRestRequests } from '../../rest-client';
import { BaseCommand } from '../../base/base';
import { Config } from '../../database/LocalDb';
import { Validator } from '../../utils/Validator';
import { RemoveUserContact, ContactService } from '../../rest-client/entities';

export class Remove extends BaseCommand {

  static description = 'Remove an existing user contact specified by user email and contact platform';

  static flags = {
    ...BaseCommand.flags,

    email: flags.string({
      char: 'e',
      description: 'user email address',
      required: true,
    }),

    platform: flags.string({
      char: 'p',
      description: '(required) choose the contact platform to delete between SLACK, EMAIL, TELEGRAM',
      options: [
        ContactService.EMAIL,
        ContactService.SLACK,
        ContactService.TELEGRAM,
      ],
    }),
  };

  async run() {
    try {
      const client: UserContactsRestRequests =
        new UserContactsRestRequests(this.db.getValues(Config.Server));

      const flagss = this.parse(Remove).flags;

      if (!flagss.platform) {
        const response: any = await inquirer.prompt([{
          choices: [
            { name: ContactService.EMAIL },
            { name: ContactService.SLACK },
            { name: ContactService.TELEGRAM },
          ],
          message: 'Select a contact platform',
          name: 'platform',
          type: 'list',
        }]);

        flagss.platform = response.platform;
      }

      const userContact: RemoveUserContact = {
        service: ContactService[flagss.platform as ContactService],
        userEmail: Validator.isEmailValid(flagss.email),
      };

      await client.remove(userContact);

      (flagss.json) ?
        this.log('{}') :
        this.log(`${flagss.platform} user contact removed successfully`);

    } catch (error) {
      this.showError(error);
    }
  }
}
