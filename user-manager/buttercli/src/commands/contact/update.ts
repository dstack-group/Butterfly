import { flags } from '@oclif/command';
import { UserContactsRestRequests } from '../../rest-client';
import { BaseCommand, TableColumns } from '../../base/base';
import { Config } from '../../database/LocalDb';
import { Validator } from '../../utils/Validator';
import { UpdateUserContact, ContactService, UserContact } from '../../rest-client/entities';

export class Update extends BaseCommand {

  static description = 'Update an existing user contact account specified by user email and contact service';

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
      description: 'choose the contact platform to update between SLACK, EMAIL, TELEGRAM',
      options: [
        ContactService.EMAIL,
        ContactService.SLACK,
        ContactService.TELEGRAM,
      ],
      required: true,
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

      const flagss = this.parse(Update).flags;

      if (flagss.platform === ContactService.EMAIL) {
        flagss.account = Validator.isEmailValid(flagss.account);
      }

      const userContact: UpdateUserContact = {
        contactRef: flagss.account,
        service: ContactService[flagss.platform as keyof typeof ContactService],
        userEmail: Validator.isEmailValid(flagss.email),
      };

      const result = await client.update(userContact);
      this.showResult<UserContact>([result], Update.columns, flagss.json);

    } catch (error) {
      this.showError(error);
    }
  }
}
