import { flags } from '@oclif/command';
import { UserContactsRestRequests } from '../../rest-client';
import { BaseCommand } from '../../base/base';
import { Config } from '../../database/LocalDb';
import { Validator } from '../../utils/Validator';
import { UpdateUserContact, ContactService } from '../../rest-client/entities';
import { CommandFlagException } from '../../exceptions';

export class Update extends BaseCommand {

  static description = 'Update an existing user contact account specified by user email and contact service';

  static flags = {
    ...BaseCommand.flags,
    email: flags.string({char: 'e', description: 'email where receive notification', exclusive: ['slack', 'telegram']}),
    slack: flags.string({char: 's', description: 'slack account', exclusive: ['telegram', 'email']}),
    telegram: flags.string({char: 't', description: 'telegram account', exclusive: ['email', 'slack']}),
    userEmail: flags.string({char: 'u', description: 'new user email address', required: true}),
  };

  async run() {
    try {
      const client: UserContactsRestRequests =
        new UserContactsRestRequests(this.db.getValues(Config.Server));

      const flagss = this.parse(Update).flags;

      let serviceSelected: ContactService;
      let identifier: string;

      if (flagss.email !== undefined) {
        serviceSelected = ContactService.EMAIL;
        identifier = Validator.isEmailValid(flagss.email);

      } else if (flagss.slack !== undefined) {
        serviceSelected = ContactService.SLACK;
        identifier = flagss.slack;

      } else if (flagss.telegram !== undefined) {
        serviceSelected = ContactService.TELEGRAM;
        identifier = flagss.telegram;

      } else {
        throw new CommandFlagException({
          message: 'One of these flags is required!',
          nameFlag: 'email | slack | telegram',
        });
      }

      const newUserContact: UpdateUserContact = {
        contactRef: identifier,
        service: serviceSelected,
        userEmail: Validator.isEmailValid(flagss.userEmail),
      };

      this.print(await client.update(newUserContact), flagss.json);

    } catch (error) {
      this.error(error.message);
    }
  }
}
