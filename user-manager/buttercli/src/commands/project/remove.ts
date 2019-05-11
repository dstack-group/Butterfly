import { flags } from '@oclif/command';
import { BaseCommand } from './../../base/base';
import { ProjectRestRequests } from '../../rest-client';
import { Config } from '../../database/LocalDb';
import { Validator } from '../../utils';
import { RemoveProject, Service } from '../../rest-client/entities';

export class Remove extends BaseCommand {

  static description = 'Remove an existing project or only the service urls specified';

  static flags = {
    ...BaseCommand.flags,

    gitlab: flags.boolean({
      char: 'g',
      description: 'remove project gitlab url',
      exclusive: ['redmine', 'sonarqube'],
    }),

    name: flags.string({
      char: 'n',
      description: 'project name (max 50 characters)',
      required: true,
    }),

    redmine: flags.boolean({
      char: 'r',
      description: 'remove project redmine url',
      exclusive: ['gitlab', 'sonarqube'],
    }),

    sonarqube: flags.boolean({
      char: 's',
      description: 'remove project sonarqube',
      exclusive: ['gitlab', 'redmine'],
    }),
  };

  async run() {
    try {
      const client: ProjectRestRequests = new ProjectRestRequests(this.db.getValues(Config.Server));
      const flagss = this.parse(Remove).flags;

      Validator.isStringValid('name', flagss.name, 0, 50);

      const project: RemoveProject = {projectName: flagss.name};

      /**
       * Add into project.service the service type selected if it was specified
       */
      if (flagss.gitlab !== undefined) {
        project.service = Service.GITLAB;
      } else if (flagss.redmine !== undefined) {
        project.service = Service.REDMINE;
      } else if (flagss.sonarqube !== undefined) {
        project.service = Service.SONARQUBE;
      }

      await client.remove(project);

      (flagss.json) ?
        this.log('{}') :
        (project.service === undefined) ?
          this.log('Project removed successfully') :
          this.log(`${project.service} project url removed successfully`);

    } catch (error) {
      this.showError(error.message);
    }
  }
}
