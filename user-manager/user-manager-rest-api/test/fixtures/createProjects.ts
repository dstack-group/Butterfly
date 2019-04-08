import { PgDatabaseConnection, GetQueries } from '../../src/database';
import { Project } from '../../src/modules/projects/entity';

const query = `INSERT INTO public.project(project_id, project_name, project_url)
               VALUES($[projectId], $[projectName], $[projectURL]::json)`;

const commonValues = {
  modified: null,
};

export interface CreateProjectResult {
  result: Project;
  transaction: Promise<void>;
}

export function createProject(database: PgDatabaseConnection): CreateProjectResult {
  const projectResult: Project = {
    projectId: '1',
    projectName: 'Butterfly',
    projectURL: {
      GITLAB: 'https://localhost:10443/dstack/butterfly.git',
      REDMINE: 'redmine.dstackgroup.com/butterfly/butterfly.git',
    },
    ...commonValues,
  };

  const getProjectQuery: GetQueries<unknown> = t => {
    const createProjectQuery = t.any(query, projectResult);
    return [createProjectQuery];
  };

  return {
    result: projectResult,
    transaction: database.transaction(getProjectQuery),
  };
}

export interface CreateProjectsResult {
  results: Project[];
  transaction: Promise<void>;
}

export function createProjects(database: PgDatabaseConnection): CreateProjectsResult {
  const projectResults: Project[] = [
    {
      projectId: '1',
      projectName: 'Butterfly',
      projectURL: {
        GITLAB: 'https://localhost:10443/dstack/butterfly.git',
        REDMINE: 'redmine.dstackgroup.com/butterfly/butterfly.git',
      },
    },
    {
      projectId: '2',
      projectName: 'Amazon',
      projectURL: {
        GITLAB: 'gitlab.amazon.com/amazon/amazon.git',
      },
    },
    {
      projectId: '3',
      projectName: 'Uber',
      projectURL: {
        GITLAB: 'gitlab.uber.com/uber/uber.git',
      },
    },
    {
      projectId: '4',
      projectName: 'Twitter',
      projectURL: {
        GITLAB: 'gitlab.twitter.com/twitter/twitter.git',
        SONARQUBE: 'sonarqube.twitter.com/twitter/twitter.git',
      },
    }
  ];

  const getProjectQueries: GetQueries<Project> = t => {
    return projectResults.map(project => t.any(query, project));
  };

  return {
    results: projectResults,
    transaction: database.transaction(getProjectQueries),
  };
}
