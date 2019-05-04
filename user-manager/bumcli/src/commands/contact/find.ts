import { flags } from '@oclif/command';
import { UserContactsRestRequests } from '../../rest-client';
import { BaseCommand } from '../../base/base';
import { Config } from '../../database/LocalDb';
import { Validator } from '../../utils/Validator';

export class Find extends BaseCommand {

  static description = 'Find all contacts of a specific user identified by email';

  static flags = {
    ...BaseCommand.flags,
    userEmail: flags.string({char: 'u', description: 'user email address', required: true}),
  };

  async run() {
    try {
      const client: UserContactsRestRequests =
        new UserContactsRestRequests(this.db.getValues(Config.Server));

      const flagss = this.parse(Find).flags;

      Validator.isEmailValid(flagss.userEmail);
      this.print(await client.find({userEmail: flagss.userEmail}), flagss.json);

    } catch (error) {
      this.error(error.message);
    }
  }
}
