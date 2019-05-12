import { flags } from '@oclif/command';
import { UserRestRequests } from '../../rest-client';
import { BaseCommand, TableColumns } from '../../base/base';
import { Config } from '../../database/LocalDb';
import { Validator } from '../../utils/Validator';

import { User } from '../../rest-client/entities/UserEntities';

export class Find extends BaseCommand {

  static description = 'Find all users or a specific user identified by email';

  static flags = {
    ...BaseCommand.flags,
    email: flags.string({char: 'e', description: 'user email address', required: true}),
  };

  private static readonly columns: TableColumns<User> = {
    userId: {minWidth: 7, extended: true},
    email: {minWidth: 7},
    firstname: {minWidth: 7},
    lastname: {minWidth: 7},
    enabled: {get: user => user.enabled ? 'T' : 'F'},
    created: {minWidth: 7, extended: true},
    modified: {minWidth: 7, extended: true},
  };

  async run() {
    try {
      const client: UserRestRequests = new UserRestRequests(this.db.getValues(Config.Server));
      const flagss = this.parse(Find).flags;

      Validator.isEmailValid(flagss.email);
      const result = await client.find({email: flagss.email});
      this.showResult<User>([result], Find.columns, flagss.json);

    } catch (error) {
      this.showError(error);
    }
  }
}
