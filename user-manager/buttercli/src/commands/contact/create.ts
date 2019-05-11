import { flags } from '@oclif/command';
import { UserContactsRestRequests } from '../../rest-client';
import { BaseCommand, TableColumns } from '../../base/base';
import { Config } from '../../database/LocalDb';
import { Validator } from '../../utils/Validator';
import { CreateUserContact, ContactService, UserContact } from '../../rest-client/entities';
import { CommandFlagException } from '../../exceptions';

export class Create extends BaseCommand {

  static description = 'Create a new user contact';

  static flags = {
    ...BaseCommand.flags,

    emailc: flags.string({
      char: 'c',
      description: 'email where notifications are sent',
      exclusive: ['slack', 'telegram'],
    }),

    slack: flags.string({
      char: 's',
      description: 'slack account',
      exclusive: ['telegram', 'emailc'],
    }),

    telegram: flags.string({
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

  private static readonly columns: TableColumns<UserContact> = {
    userContactId: {minWidth: 15},
    userEmail: {minWidth: 15},
    contactService: {minWidth: 40},
    contactRef: {minWidth: 40},
  };

  async run() {
    try {
      const client: UserContactsRestRequests =
        new UserContactsRestRequests(this.db.getValues(Config.Server));

      const flagss = this.parse(Create).flags;

      let serviceSelected: ContactService;
      let identifier: string;

      if (flagss.emailc !== undefined) {
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
          nameFlag: 'emailc | slack | telegram',
        });
      }

      const newUserContact: CreateUserContact = {
        contactRef: identifier,
        service: serviceSelected,
        userEmail: Validator.isEmailValid(flagss.email),
      };

      const result = await client.create(newUserContact);
      this.showResult<UserContact>([result], Create.columns, flagss.json);

    } catch (error) {
      this.showError(error);
    }
  }
}
