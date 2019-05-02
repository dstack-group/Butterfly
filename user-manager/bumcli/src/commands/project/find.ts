import { flags } from '@oclif/command';
import { BaseCommand } from './../../base/base';
import { ProjectRestRequests } from '../../rest-client';
import { Config } from '../../database/LocalDb';

export class Find extends BaseCommand {

  static description = 'Find all projects or a specific project identified by name';

  static flags = {
    ...BaseCommand.flags,
    name: flags.string({char: 'n', description: 'project name'}),
  };

  async run() {
    try {
      const client: ProjectRestRequests = new ProjectRestRequests(this.db.getValues(Config.Server));
      const flagss = this.parse(Find).flags;

      (flagss.name === undefined) ?
        this.print(await client.findAll(), flagss.json) :
        this.print(await client.find({name: flagss.name}), flagss.json);

    } catch (error) {
      this.error(error.message);
    }
  }
}
