/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    user-manager-rest-api
 * @fileName:  router.ts
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

import { Router } from '../../router/Router';
import { ProjectManager } from './manager';
import { ProjectRepository } from './repository';
import { RoutesInjectionParams } from '../../routes/RoutesInjectionParams';
import * as middlewares from '../../middlewares';
import { ProjectController } from './controller';

export const getProjectRouter = (routesParams: RoutesInjectionParams) => {
  const projectRouter = new Router('/projects');
  const projectRepository = new ProjectRepository(routesParams.database);
  const projectManager = new ProjectManager(projectRepository);
  const projectController = new ProjectController(routesParams.routeContextReplierFactory, projectManager);

  projectRouter
    .get('/', projectController.getProjects())
    .post('/',
      middlewares.bodyParser(),
      projectController.createProject())
    .get('/:projectName', projectController.getProjectByName())
    .put('/:projectName',
      middlewares.bodyParser(),
      projectController.updateProjectByName())
    .delete('/:projectName', projectController.deleteProjectByName())
    .delete('/:projectName/:producerService', projectController.removeServiceURL());

  return projectRouter;
};
