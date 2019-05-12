import { Command, flags } from '@oclif/command';
import { BaseCommand, TableColumns } from '../../base/base';
import { Config, ServerConfig, UserInfo } from '../../database';

export class List extends BaseCommand {

  static description = 'List all the configuration settings or only a subset of them';

  static flags = {
    ...BaseCommand.flags,
    server: flags.boolean({ char: 's', description: 'Get only the server settings' }),
    user: flags.boolean({ char: 'u', description: 'Get only the user settings' }),
  };

  private static readonly serverColumns: TableColumns<ServerConfig> = {
    hostname: { minWidth: 40 },
    port: { minWidth: 15 },
    timeout: { minWidth: 15 },
  };

  private static readonly userColumns: TableColumns<UserInfo> = {
    email: { minWidth: 40 },
    firstname: { minWidth: 15 },
    lastname: { minWidth: 15 },
  };

  async run() {
    try {

      const flagss = this.parse(List).flags;

      if (!flagss.user && !flagss.server) {
        this.log('All configuration:');

        const userResult = this.db.getValues(Config.User);
        this.showResult<UserInfo>([userResult], List.userColumns, flagss.json);

        this.log('\n');

        const serverResult = this.db.getValues(Config.Server);
        this.showResult<ServerConfig>([serverResult], List.serverColumns, flagss.json);
      }

      if (flagss.user) {
        this.log('User informations:');
        const userResult = this.db.getValues(Config.User);
        this.showResult<UserInfo>([userResult], List.userColumns, flagss.json);
      }

      if (flagss.server) {
        this.log('Server configuration settings:');
        const serverResult = this.db.getValues(Config.Server);
        this.showResult<ServerConfig>([serverResult], List.serverColumns, flagss.json);
      }
    } catch (error) {
      this.showError(error);
    }
  }
}
