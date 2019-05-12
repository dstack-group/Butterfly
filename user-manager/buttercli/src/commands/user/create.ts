import { flags } from '@oclif/command';
import { UserRestRequests } from '../../rest-client';
import { BaseCommand } from '../../base';
import { TableColumns } from '../../base/base';
import { Config } from '../../database/LocalDb';
import { Validator } from '../../utils/Validator';
import { CreateUser, User } from '../../rest-client/entities';

export class Create extends BaseCommand {

  static description = 'Create a new user';

  static flags = {
    ...BaseCommand.flags,

    available: flags.boolean({
      allowNo: true,
      char: 'a',
      default: true,
      description: 'the new user is currently available (default is true)',
    }),

    email: flags.string({
      char: 'e',
      description: 'new user email address',
      required: true,
    }),

    firstname: flags.string({
      char: 'f',
      description: 'new user first name (max 30 characters)',
      required: true,
    }),

    lastname: flags.string({
      char: 'l',
      description: 'new user last name (max 30 characters)',
      required: true,
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
      const flagss = this.parse(Create).flags;

      const newUser: CreateUser = {
        email: Validator.isEmailValid(flagss.email),
        enabled: flagss.available,
        firstname: Validator.isStringValid('firstname', flagss.firstname, 0, 30),
        lastname: Validator.isStringValid('lastname', flagss.lastname, 0, 30),
      };

      const result = await client.create(newUser);
      this.showResult<User>([result], Create.columns, flagss.json);

    } catch (error) {
      this.showError(error);
    }
  }
}
