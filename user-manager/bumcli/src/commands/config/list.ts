import {Command, flags} from '@oclif/command';
import { BaseCommand } from '../../base/base';
import { Config } from '../../database/LocalDb';

export default class List extends BaseCommand {

  static description = 'List all the configuration settings or only a subset of them';

  static flags = {
    help: flags.help({char: 'h'}),
    server: flags.boolean({char: 's', description: 'Get only the server settings'}),
    user: flags.boolean({char: 'u', description: 'Get only the user settings'}),
  };

  async run() {

    const flagss = this.parse(List).flags;

    if (!flagss.user && !flagss.server) {
      this.log('All configuration:');
      this.log(this.showJSONFormat(this.db.getValues(Config.User)));
      this.log(this.showJSONFormat(this.db.getValues(Config.Server)));
    }

    if (flagss.user) {
      this.log('User informations:');
      this.log(this.showJSONFormat(this.db.getValues(Config.User)));
    }

    if (flagss.server) {
      this.log('Server configuration settings:');
      this.log(this.showJSONFormat(this.db.getValues(Config.Server)));
    }
  }
}
