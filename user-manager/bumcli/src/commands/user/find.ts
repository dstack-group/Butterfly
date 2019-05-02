import { flags } from '@oclif/command';
import { UserRestRequests } from '../../rest-client';
import { BaseCommand } from '../../base/base';
import { Config } from '../../database/LocalDb';
import { Validator } from '../../utils/Validator';

export class Find extends BaseCommand {

  static description = 'Find all users or a specific user identified by email';

  static flags = {
    ...BaseCommand.flags,
    email: flags.string({char: 'e', description: 'email address'}),
  };

  async run() {
    try {
      const client: UserRestRequests = new UserRestRequests(this.db.getValues(Config.Server));
      const flagss = this.parse(Find).flags;

      if (flagss.email === undefined) {
        this.print(await client.findAll(), flagss.json);
      } else {

        if (Validator.isEmailValid(flagss.email)) {
          this.print(await client.find({email: flagss.email}), flagss.json);
        }
      }
    } catch (error) {
      this.error(error.message);
    }
  }
}
