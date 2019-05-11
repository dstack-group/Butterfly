import { flags } from '@oclif/command';
import { UserContactsRestRequests } from '../../rest-client';
import { UserContacts } from '../../rest-client/entities';
import { BaseCommand, TableColumns } from '../../base/base';
import { Config } from '../../database/LocalDb';
import { Validator } from '../../utils/Validator';

export class Find extends BaseCommand {

  static description = 'Find all contacts of a specific user identified by email';

  static flags = {
    ...BaseCommand.flags,
    email: flags.string({
      char: 'e',
      description: 'user email address',
      required: true,
    }),
  };

  private static readonly columns: TableColumns<UserContacts> = {
    EMAIL: {
      get: service => service.EMAIL ? service.EMAIL : 'No id stored',
      minWidth: 15,
    },
    SLACK: {
      get: service => service.SLACK ? service.SLACK : 'No id stored',
      minWidth: 15,
    },
    TELEGRAM: {
      get: service => service.TELEGRAM ? service.TELEGRAM : 'No id stored',
      minWidth: 15,
    },
  };

  async run() {
    try {
      const client: UserContactsRestRequests =
        new UserContactsRestRequests(this.db.getValues(Config.Server));

      const flagss = this.parse(Find).flags;

      Validator.isEmailValid(flagss.email);
      const result = await client.find({userEmail: flagss.email});
      this.showResult<UserContacts>([result], Find.columns, flagss.json);

    } catch (error) {
      this.showError(error);
    }
  }
}
