import { flags } from '@oclif/command';
import { UserRestRequests } from '../../rest-client';
import { BaseCommand } from '../../base/base';
import { Config } from '../../database/LocalDb';
import { Validator } from '../../utils/Validator';
import { CreateUser } from '../../rest-client/entities';

export class Create extends BaseCommand {

  static description = 'Create new user';

  static flags = {
    ...BaseCommand.flags,
    available: flags.boolean({
      allowNo: true,
      char: 'a',
      default: true,
      description: 'the new user is currently available (default is true)',
    }),
    email: flags.string({char: 'e', description: 'new user email address', required: true}),
    firstname: flags.string({char: 'f', description: 'new user first name (max 30 characters)', required: true}),
    lastname: flags.string({char: 'l', description: 'new user last name (max 30 characters)', required: true}),
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

      this.print(await client.create(newUser), flagss.json);

    } catch (error) {
      this.error(error.message);
    }
  }
}
