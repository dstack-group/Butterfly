import { flags } from '@oclif/command';
import { UserRestRequests } from '../../rest-client';
import { BaseCommand } from '../../base/base';
import { Config } from '../../database/LocalDb';
import { Validator } from '../../utils/Validator';
import { UpdateUser } from '../../rest-client/entities';

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
    email: flags.string({char: 'e', description: 'user email address', required: true}),
    firstname: flags.string({char: 'f', description: 'new first name (max 30 characters)'}),
    lastname: flags.string({char: 'l', description: 'new last name (max 30 characters)'}),
  };

  async run() {
    try {
      const client: UserRestRequests = new UserRestRequests(this.db.getValues(Config.Server));
      const flagss = this.parse(Update).flags;

      const user: UpdateUser = {email: Validator.isEmailValid(flagss.email)};

      /*
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

      this.print(await client.update(user), flagss.json);

    } catch (error) {
      this.error(error.message);
    }
  }
}
