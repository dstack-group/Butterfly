import { flags } from '@oclif/command';
import { BaseCommand, TableColumns } from './../../base/base';
import { ProjectRestRequests } from '../../rest-client';
import { UpdateProject, Project } from '../../rest-client/entities';
import { Config } from '../../database/LocalDb';
import { Validator } from '../../utils';
import { CommandFlagException } from '../../exceptions';

export class Update extends BaseCommand {

  static description = 'Update an existing service url of the project identified by name';

  static flags = {
    ...BaseCommand.flags,

    gitlab: flags.string({
      char: 'g',
      description: 'new gitlab url of the project',
    }),

    name: flags.string({
      char: 'n',
      description: 'project name (max 50 characters)',
      required: true,
    }),

    redmine: flags.string({
      char: 'r',
      description: 'new redmine url of the project',
    }),

    sonarqube: flags.string({
      char: 's',
      description: 'new sonarqube url of the project',
    }),
  };

  private static readonly columns: TableColumns<Project> = {
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
    gitlab: {
      get: projects =>
            projects.projectURL.GITLAB ?
              projects.projectURL.GITLAB :
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
      const flagss = this.parse(Update).flags;

      const project: UpdateProject = {
        projectName: Validator.isStringValid('name', flagss.name, 0, 50),
        projectURL: {},
      };

      /**
       * Add into newProject.urls only the service url specified in input
       */

      let oneProjectIsSelected: boolean = false;

      if (flagss.gitlab !== undefined) {
        project.projectURL.GITLAB = Validator.isURLValid(flagss.gitlab);
        oneProjectIsSelected = true;
      }

      if (flagss.redmine !== undefined) {
        project.projectURL.REDMINE = Validator.isURLValid(flagss.redmine);
        oneProjectIsSelected = true;
      }

      if (flagss.sonarqube !== undefined) {
        project.projectURL.SONARQUBE = Validator.isURLValid(flagss.sonarqube);
        oneProjectIsSelected = true;
      }

      if (oneProjectIsSelected === false) {
        throw new CommandFlagException({
          message: 'At least one of these flags is required!',
          nameFlag: 'gitlab | redmine | sonarqube',
        });
      }

      const result = await client.update(project);
      this.showResult<Project>([result], Update.columns, flagss.json);

    } catch (error) {
      this.showError(error);
    }
  }
}
