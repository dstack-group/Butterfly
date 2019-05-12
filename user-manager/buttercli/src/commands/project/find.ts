import { flags } from '@oclif/command';
import { BaseCommand, TableColumns } from './../../base/base';
import { ProjectRestRequests } from '../../rest-client';
import { Project } from '../../rest-client/entities';
import { Config } from '../../database/LocalDb';
import { Validator } from '../../utils';

export class Find extends BaseCommand {

  static description = 'Find a specific project identified by name';

  static flags = {
    ...BaseCommand.flags,
    name: flags.string({
      char: 'n',
      description: 'project name (max 50 characters)',
      required: true,
    }),
  };

  private static readonly columns: TableColumns<Project> = {
    gitlab: {
      get: projects =>
            projects.projectURL.GITLAB ?
              projects.projectURL.GITLAB :
              'No associated link',
      minWidth: 40,
    },
    projectId: {
      minWidth: 15,
    },
    projectName: {
     minWidth: 15,
    },
    redmine: {
      get: projects =>
            projects.projectURL.REDMINE ?
              projects.projectURL.REDMINE :
              'No associated link',
      minWidth: 40,
    },
    sonarqube: {
      get: projects =>
            projects.projectURL.SONARQUBE ?
              projects.projectURL.SONARQUBE :
              'No associated link',
      minWidth: 40,
    },
  };

  async run() {
    try {
      const client: ProjectRestRequests = new ProjectRestRequests(this.db.getValues(Config.Server));
      const flagss = this.parse(Find).flags;

      Validator.isStringValid('name', flagss.name, 0, 50);
      const result = await client.find({projectName: flagss.name});
      this.showResult<Project>([result], Find.columns, flagss.json);

    } catch (error) {
      this.showError(error);
    }
  }
}
