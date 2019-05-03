import { flags } from '@oclif/command';
import { UserRestRequests } from '../../rest-client';
import { BaseCommand } from '../../base/base';
import { Config } from '../../database/LocalDb';
import { Validator } from '../../utils/Validator';

export class Remove extends BaseCommand {

  static description = 'Find all users or a specific user identified by email';

  static flags = {
    ...BaseCommand.flags,
    email: flags.string({char: 'e', description: 'user email address', required: true}),
  };

  async run() {
    try {
      const client: UserRestRequests = new UserRestRequests(this.db.getValues(Config.Server));
      const flagss = this.parse(Remove).flags;

      Validator.isEmailValid(flagss.email);

      // Throw an exception if there isn't an user with this email
      // so the next instruction is executed if the user is removed successfully
      await client.remove({email: flagss.email});

      (flagss.json) ? this.log('{}') : this.log('User removed successfully');

    } catch (error) {
      this.error(error.message);
    }
  }
}
