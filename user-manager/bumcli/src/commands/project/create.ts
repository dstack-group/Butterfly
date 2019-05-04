import { flags } from '@oclif/command';
import { BaseCommand } from './../../base/base';
import { ProjectRestRequests } from '../../rest-client';
import { CreateProject } from '../../rest-client/entities';
import { Config } from '../../database/LocalDb';
import { Validator } from '../../utils';

export class Create extends BaseCommand {

  static description = 'Create a new project specifing one or more service urls';

  static flags = {
    ...BaseCommand.flags,
    gitlab: flags.string({char: 'g', description: 'gitlab url of the new project'}),
    name: flags.string({char: 'n', description: 'project name (max 50 characters)', required: true}),
    redmine: flags.string({char: 'r', description: 'redmine url of the new project'}),
    sonarqube: flags.string({char: 's', description: 'sonarqube url of the new project'}),
  };

  async run() {
    try {
      const client: ProjectRestRequests = new ProjectRestRequests(this.db.getValues(Config.Server));
      const flagss = this.parse(Create).flags;

      const newProject: CreateProject = {
        projectName: Validator.isStringValid('name', flagss.name, 0, 50),
        projectURL: {},
      };

      /*
       * Add into newProject.urls only the service url specified in input
       */
      if (flagss.gitlab !== undefined) {
        newProject.projectURL.GITLAB = Validator.isURLValid(flagss.gitlab);
      }

      if (flagss.redmine !== undefined) {
        newProject.projectURL.REDMINE = Validator.isURLValid(flagss.redmine);
      }

      if (flagss.sonarqube !== undefined) {
        newProject.projectURL.SONARQUBE = Validator.isURLValid(flagss.sonarqube);
      }

      this.print(await client.create(newProject), flagss.json);

    } catch (error) {
      this.error(error.message);
    }
  }
}
