import { flags } from '@oclif/command';
import { BaseCommand, TableColumns } from '../../base/base';
import { Validator } from '../../utils/Validator';
import { Config } from '../../database/LocalDb';
import { ServerConfig } from '../../database/ServerConfig';

export class Server extends BaseCommand {

  static description = `Set all the server settings or only a subset of them.
  Remember that every time that config:server is invoked all the old server settings will be overwritten`;

  static flags = {
    ...BaseCommand.flags,

    hostname: flags.string({
      char: 'n',
      description: 'Set the hostname of the user-manager server',
      required: true,
    }),

    port: flags.integer({
      char: 'p',
      dependsOn: ['hostname'],
      description: 'Set the port of the user-manager server',
      required: true,
    }),

    timeout: flags.integer({ char: 't', description: 'Set a timeout for the server connection' }),
  };

  private static readonly columns: TableColumns<ServerConfig> = {
    hostname: { minWidth: 30 },
    port: { minWidth: 15 },
    timeout: { minWidth: 15 },
  };

  async run() {
    try {

      const flagss = this.parse(Server).flags;

      // TODO: When all the values of ServerConfig are already memorized into the db
      //       and the user set again only a subset of them I need to delete the
      //       values not setted again? Now it removes them
      const serverConfig: ServerConfig = { hostname: '', port: 0 };

      // Check if each flag exists before using it

      // Thanks to 'required' and 'dependOn'properties this check is not necessary
      // (flagss.hostname !== undefined && flagss.port !== undefined)

      Validator.isURLValid(flagss.hostname);
      serverConfig.hostname = flagss.hostname;
      serverConfig.port = flagss.port;

      if (flagss.timeout !== undefined) {
        serverConfig.timeout = flagss.timeout;
      }

      this.db.setValues(Config.Server, serverConfig);
      const result = this.db.getValues(Config.Server);
      this.showResult<ServerConfig>([result], Server.columns, flagss.json);

    } catch (error) {
      this.showError(error);
    }
  }
}
