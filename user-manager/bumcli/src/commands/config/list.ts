import {Command, flags} from '@oclif/command';
import { BaseCommand } from '../../base/base';
import { Config } from '../../database/LocalDb';

export class List extends BaseCommand {

  static description = 'List all the configuration settings or only a subset of them';

  static flags = {
    ...BaseCommand.flags,
    server: flags.boolean({char: 's', description: 'Get only the server settings'}),
    user: flags.boolean({char: 'u', description: 'Get only the user settings'}),
  };

  async run() {

    const flagss = this.parse(List).flags;

    if (!flagss.user && !flagss.server) {
      this.log('All configuration:');
      this.print(this.db.getValues(Config.User), flagss.json);
      this.print(this.db.getValues(Config.Server), flagss.json);
    }

    if (flagss.user) {
      this.log('User informations:');
      this.print(this.db.getValues(Config.User), flagss.json);
    }

    if (flagss.server) {
      this.log('Server configuration settings:');
      this.print(this.db.getValues(Config.Server), flagss.json);
    }
  }
}
