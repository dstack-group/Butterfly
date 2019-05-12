import { flags } from '@oclif/command';
import { UserRestRequests } from '../../rest-client';
import { BaseCommand, TableColumns } from '../../base/base';
import { Config } from '../../database/LocalDb';
import { Validator } from '../../utils/Validator';
import { User, UpdateUser } from '../../rest-client/entities';

export class Update extends BaseCommand {

  static description = 'Update an existing user identified by email';

  static flags = {
    ...BaseCommand.flags,

    available: flags.boolean({
      allowNo: true,
      char: 'a',
      // 'default: true' is not necessary because the update process
      // must not change this value if the user does not use this flag
      description: 'the user is currently available (default is true)',
    }),

    email: flags.string({
      char: 'e',
      description: 'user email address',
      required: true,
    }),

    firstname: flags.string({
      char: 'f',
      description: 'new first name (max 30 characters)',
    }),

    lastname: flags.string({
      char: 'l',
      description: 'new last name (max 30 characters)',
    }),
  };

  private static readonly columns: TableColumns<User> = {
    created: { minWidth: 7, extended: true },
    email: { minWidth: 7 },
    enabled: { get: user => user.enabled ? 'T' : 'F' },
    firstname: { minWidth: 7 },
    lastname: { minWidth: 7 },
    modified: { minWidth: 7, extended: true },
    userId: { minWidth: 7, extended: true },
  };

  async run() {
    try {
      const client: UserRestRequests = new UserRestRequests(this.db.getValues(Config.Server));
      const flagss = this.parse(Update).flags;

      const user: UpdateUser = { email: Validator.isEmailValid(flagss.email) };

      /**
       * Add the user properties updated
       */

      if (flagss.firstname !== undefined) {
        user.firstname = Validator.isStringValid('firstname', flagss.firstname, 0, 30);
      }

      if (flagss.lastname !== undefined) {
        user.lastname = Validator.isStringValid('lastname', flagss.lastname, 0, 30);
      }

      if (flagss.available !== undefined) {
        user.enabled = flagss.available;
      }

      const result = await client.update(user);
      this.showResult<User>([result], Update.columns, flagss.json);

    } catch (error) {
      this.showError(error);
    }
  }
}
