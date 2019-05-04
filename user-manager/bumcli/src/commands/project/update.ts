import { flags } from '@oclif/command';
import { BaseCommand } from './../../base/base';
import { ProjectRestRequests } from '../../rest-client';
import { UpdateProject } from '../../rest-client/entities';
import { Config } from '../../database/LocalDb';
import { Validator } from '../../utils';

export class Update extends BaseCommand {

  static description = 'Update an existing service url of the project identified by name';

  static flags = {
    ...BaseCommand.flags,
    gitlab: flags.string({char: 'g', description: 'new gitlab url of the project'}),
    name: flags.string({char: 'n', description: 'project name (max 50 characters)', required: true}),
    redmine: flags.string({char: 'r', description: 'new redmine url of the project'}),
    sonarqube: flags.string({char: 's', description: 'new sonarqube url of the project'}),
  };

  async run() {
    try {
      const client: ProjectRestRequests = new ProjectRestRequests(this.db.getValues(Config.Server));
      const flagss = this.parse(Update).flags;

      const project: UpdateProject = {
        projectName: Validator.isStringValid('name', flagss.name, 0, 50),
        projectURL: {},
      };

      /*
       * Add into project.urls only the service url specified in input
       */
      if (flagss.gitlab !== undefined) {
        project.projectURL.GITLAB = Validator.isURLValid(flagss.gitlab);
      }

      if (flagss.redmine !== undefined) {
        project.projectURL.REDMINE = Validator.isURLValid(flagss.redmine);
      }

      if (flagss.sonarqube !== undefined) {
        project.projectURL.SONARQUBE = Validator.isURLValid(flagss.sonarqube);
      }

      this.print(await client.update(project), flagss.json);

    } catch (error) {
      this.error(error.message);
    }
  }
}
