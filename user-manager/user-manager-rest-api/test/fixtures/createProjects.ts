import { PgDatabaseConnection, GetQueries } from '../../src/database';

export function createProjects(database: PgDatabaseConnection): Promise<void> {
  const query = `INSERT INTO public.project(project_id, project_name, project_url)
                 VALUES($[projectId], $[projectName], $[projectUrl]::json)`;

  const getProjectQueries: GetQueries<unknown> = t => {
    const createProjectQueries: Array<Promise<Array<unknown>>> = [];
    createProjectQueries.push(t.any(query, {
      projectId: 1,
      projectName: 'Butterfly',
      projectUrl: {
        gitlab: 'https://localhost:10443/dstack/butterfly.git',
        redmine: 'redmine.dstackgroup.com/butterfly/butterfly.git',
      },
    }));
    createProjectQueries.push(t.any(query, {
      projectId: 2,
      projectName: 'Amazon',
      projectUrl: {
        gitlab: 'gitlab.amazon.com/amazon/amazon.git',
      },
    }));
    createProjectQueries.push(t.any(query, {
      projectId: 3,
      projectName: 'Uber',
      projectUrl: {
        gitlab: 'gitlab.uber.com/uber/uber.git',
      },
    }));
    createProjectQueries.push(t.any(query, {
      projectId: 4,
      projectName: 'Twitter',
      projectUrl: {
        gitlab: 'gitlab.twitter.com/twitter/twitter.git',
        sonarqube: 'sonarqube.twitter.com/twitter/twitter.git',
      },
    }));

    return createProjectQueries;
  };

  return database.transaction(getProjectQueries);
}
