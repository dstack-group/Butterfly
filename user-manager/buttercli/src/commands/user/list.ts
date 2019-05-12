import { UserRestRequests } from '../../rest-client';
import { BaseCommand, TableColumns } from '../../base/base';
import { Config } from '../../database/LocalDb';

import { User } from '../../rest-client/entities/UserEntities';

export class List extends BaseCommand {

  static description = 'Show a list of all users';

  static flags = {
    ...BaseCommand.flags,
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
      const flagss = this.parse(List).flags;

      this.showResult<User>(await client.findAll(), List.columns, flagss.json);

    } catch (error) {
      this.showError(error);
    }
  }
}
