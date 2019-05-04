import { flags } from '@oclif/command';
import { UserContactsRestRequests } from '../../rest-client';
import { BaseCommand } from '../../base/base';
import { Config } from '../../database/LocalDb';
import { Validator } from '../../utils/Validator';
import { CreateUserContact, ContactService } from '../../rest-client/entities';
import { CommandFlagException } from '../../exceptions';

export class Create extends BaseCommand {

  static description = 'Create a new user contact';

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

      const flagss = this.parse(Create).flags;

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

      const newUserContact: CreateUserContact = {
        contactRef: identifier,
        service: serviceSelected,
        userEmail: Validator.isEmailValid(flagss.userEmail),
      };

      this.print(await client.create(newUserContact), flagss.json);

    } catch (error) {
      this.error(error.message);
    }
  }
}
