import { flags } from '@oclif/command';
import { BaseCommand, TableColumns } from './../../base/base';
import { ProjectRestRequests } from '../../rest-client';
import { CreateProject, Project } from '../../rest-client/entities';
import { Config } from '../../database/LocalDb';
import { Validator } from '../../utils';
import { CommandFlagException } from '../../exceptions';

export class Create extends BaseCommand {

  static description = 'Create a new project specifing one or more service urls';

  static flags = {
    ...BaseCommand.flags,

    gitlab: flags.string({
      char: 'g',
      description: 'gitlab url of the new project',
    }),

    name: flags.string({
      char: 'n',
      description: 'project name (max 50 characters)',
      required: true,
    }),

    redmine: flags.string({
      char: 'r',
      description: 'redmine url of the new project',
    }),

    sonarqube: flags.string({
      char: 's',
      description: 'sonarqube url of the new project',
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
      const flagss = this.parse(Create).flags;

      const newProject: CreateProject = {
        projectName: Validator.isStringValid('name', flagss.name, 0, 50),
        projectURL: {},
      };

      /**
       * Add into newProject.urls only the service url specified in input
       */

      let oneProjectIsSelected: boolean = false;

      if (flagss.gitlab !== undefined) {
        newProject.projectURL.GITLAB = Validator.isURLValid(flagss.gitlab);
        oneProjectIsSelected = true;
      }

      if (flagss.redmine !== undefined) {
        newProject.projectURL.REDMINE = Validator.isURLValid(flagss.redmine);
        oneProjectIsSelected = true;
      }

      if (flagss.sonarqube !== undefined) {
        newProject.projectURL.SONARQUBE = Validator.isURLValid(flagss.sonarqube);
        oneProjectIsSelected = true;
      }

      if (oneProjectIsSelected === false) {
        throw new CommandFlagException({
          message: 'At least one of these flags is required!',
          nameFlag: 'gitlab | redmine | sonarqube',
        });
      }

      const result = await client.create(newProject);
      this.showResult<Project>([result], Create.columns, flagss.json);

    } catch (error) {
      this.showError(error);
    }
  }
}
