import { BaseCommand, TableColumns } from './../../base/base';
import { ProjectRestRequests } from '../../rest-client';
import { Project } from '../../rest-client/entities';
import { Config } from '../../database/LocalDb';

export class List extends BaseCommand {

  static description = 'Show a list of all projects';

  static flags = {
    ...BaseCommand.flags,
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
      const flagss = this.parse(List).flags;

      this.showResult<Project>(await client.findAll(), List.columns, flagss.json);

    } catch (error) {
      this.showError(error);
    }
  }
}
