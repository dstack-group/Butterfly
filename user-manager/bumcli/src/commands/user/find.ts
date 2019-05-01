import { flags } from '@oclif/command';
import { UserRestRequests } from '../../rest-client';
import { BaseCommand } from '../../base/base';
import { User } from '../../rest-client/entities/UserEntities';
import { Config } from '../../database/LocalDb';
import { Validator } from '../../utils/Validator';

export default class Find extends BaseCommand {

  static description = 'Find a user by email';

  static flags = {
    email: flags.string({char: 'e', description: 'email address [required]', required: true}),
    help: flags.help({char: 'h'}),
    table: flags.boolean({char: 't', description: 'display results in table form'}),
  };

  async run() {
    try {
      const client: UserRestRequests = new UserRestRequests(this.db.getValues(Config.Server));
      const flagss = this.parse(Find).flags;

      if (Validator.isEmailValid(flagss.email)) {
        const dataUser: User = await client.find({email: flagss.email});

        if (flagss.table) {
          this.lista(dataUser);
        } else {
          this.log(dataUser);
        }
      }
    } catch (error) {
      this.error(error.message);
    }
  }
}
