import { Command, flags } from '@oclif/command';
import { cli } from 'cli-ux';
import { LocalDb, Config } from '../database/LocalDb';
import { ServerConfig } from '../database/ServerConfig';
import * as fs from 'fs';
import * as path from 'path';

export class Init extends Command {

  static description = 'Initialize the db and set all the server settings';

  async run() {

    this.log('Butterfly User Manager server configuration:');
    const newHostname = await cli.prompt('Insert the server hostname');
    const newPort = await cli.prompt('Insert the server port');
    const newTimeout = await cli.prompt(
      'Insert a timeout',
      { required: false, default: '1000' },
    );

    const serverConfig: ServerConfig = {
      hostname: newHostname,
      port: newPort,
      timeout: newTimeout,
    };

    const configPath: string = path.join(this.config.configDir);

    try {
    // Create the db directory if doesn't exist yet
    fs.mkdir(configPath, {}, error => {
      if (error && error.code !== 'EEXIST') {
        throw error;
      }
    });

    // Create and initialize the db and save the configuration
    const db = new LocalDb(`${configPath}/db.json`);
    db.setValues(Config.Server, serverConfig);
    this.log('\nConfiguration saved successfully!');

    } catch (error) {
      this.error(error.message);
    }
  }
}
