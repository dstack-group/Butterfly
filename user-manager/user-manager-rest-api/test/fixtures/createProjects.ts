/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    user-manager-rest-api
 * @fileName:  createProjects.ts
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

import { PgDatabaseConnection, GetQueries } from '../../src/database';
import { Project } from '../../src/modules/projects/entity';

const query = `INSERT INTO public.project(project_id, project_name, project_url)
               VALUES($[projectId], $[projectName], $[projectURL]::json)`;

export const createProjectQuery = query;

const commonValues = {
  modified: null,
};

export interface CreateProjectResult {
  result: Project;
  transaction: Promise<void>;
}

export function createProject(database: PgDatabaseConnection, project: Partial<Project> = {}): CreateProjectResult {
  const projectResult: Project = {
    projectId: '1',
    projectName: 'Butterfly',
    projectURL: {
      ...project.projectURL,
    },
    ...project,
    ...commonValues,
  };

  if (!project.projectURL) {
    projectResult.projectURL = {
      GITLAB: 'https://localhost:10443/dstack/butterfly.git',
      REDMINE: 'redmine.dstackgroup.com/butterfly/butterfly.git',
    };
  }

  const getProjectQuery: GetQueries<unknown> = t => {
    const projectQuery = t.any(query, projectResult);
    return [projectQuery];
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

export function createProjects(database: PgDatabaseConnection, projectResults?: Project[]): CreateProjectsResult {
  const defaultProjectResults: Project[] = [
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
    },
  ];

  const actualProjectResults = projectResults || defaultProjectResults;

  const getProjectQueries: GetQueries<Project> = t => {
    return actualProjectResults.map(project => t.any(query, project));
  };

  return {
    results: actualProjectResults,
    transaction: database.transaction(getProjectQueries),
  };
}
