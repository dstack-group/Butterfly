import { flags } from '@oclif/command';
import { UserContactsRestRequests } from '../../rest-client';
import { BaseCommand } from '../../base/base';
import { Config } from '../../database/LocalDb';
import { Validator } from '../../utils/Validator';
import { RemoveUserContact, ContactService } from '../../rest-client/entities';
import { CommandFlagException } from '../../exceptions';

export class Remove extends BaseCommand {

  static description = 'Remove an existing user contact specified by user email and contact service';

  static flags = {
    ...BaseCommand.flags,

    emailc: flags.boolean({
      char: 'm',
      description: 'remove email account',
      exclusive: ['slack', 'telegram'],
    }),

    slack: flags.boolean({
      char: 's',
      description: 'slack account',
      exclusive: ['telegram', 'emailc'],
    }),

    telegram: flags.boolean({
      char: 't',
      description: 'telegram account',
      exclusive: ['emailc', 'slack'],
    }),

    email: flags.string({
      char: 'e',
      description: 'user email address',
      required: true,
    }),
  };

  async run() {
    try {
      const client: UserContactsRestRequests =
        new UserContactsRestRequests(this.db.getValues(Config.Server));

      const flagss = this.parse(Remove).flags;

      let serviceSelected: ContactService;

      if (flagss.emailc !== undefined) {
        serviceSelected = ContactService.EMAIL;

      } else if (flagss.slack !== undefined) {
        serviceSelected = ContactService.SLACK;

      } else if (flagss.telegram !== undefined) {
        serviceSelected = ContactService.TELEGRAM;

      } else {
        throw new CommandFlagException({
          message: 'One of these flags is required!',
          nameFlag: 'emailc | slack | telegram',
        });
      }

      const userContact: RemoveUserContact = {
        service: serviceSelected,
        userEmail: Validator.isEmailValid(flagss.email),
      };

      await client.remove(userContact);

      (flagss.json) ?
        this.log('{}') :
        this.log(`${serviceSelected} user contact removed successfully`);

    } catch (error) {
      this.showError(error);
    }
  }
}
