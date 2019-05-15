import { flags } from '@oclif/command';
import * as inquirer from 'inquirer';
import { BaseCommand } from './../../base/base';
import { ProjectRestRequests } from '../../rest-client';
import { Config } from '../../database/LocalDb';
import { Validator } from '../../utils';
import { RemoveProject, Service } from '../../rest-client/entities';

export class Remove extends BaseCommand {

  static description = 'Remove an existing project or only the service urls specified';

  static flags = {
    ...BaseCommand.flags,

    service: flags.string({
      char: 's',
      description: 'remove service between GITLAB, REDMINE, SONARQUBE or ALL of them',
      options: ['ALL', 'GITLAB', 'REDMINE', 'SONARQUBE'],
    }),

    name: flags.string({
      char: 'n',
      description: 'project name (max 50 characters)',
      required: true,
    }),
  };

  async run() {
    try {
      const client: ProjectRestRequests = new ProjectRestRequests(this.db.getValues(Config.Server));
      const flagss = this.parse(Remove).flags;

      Validator.isStringValid('name', flagss.name, 0, 50);

      if (!flagss.service) {
        const response: any = await inquirer.prompt([{
          choices: [
            { name: 'ALL' },
            { name: Service.GITLAB },
            { name: Service.REDMINE },
            { name: Service.SONARQUBE },
          ],
          message: 'Select a service',
          name: 'service',
          type: 'list',
        }]);

        flagss.service = response.service;
      }

      const project: RemoveProject = {projectName: flagss.name};

      if (flagss.service !== 'ALL') {
        project.service = flagss.service as Service;
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
