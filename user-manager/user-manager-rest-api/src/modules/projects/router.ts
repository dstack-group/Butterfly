import { Router } from '../../router/Router';
import { ProjectManager } from './manager';
import { ProjectRepository } from './repository';
import { RoutesInjectionParams } from '../../routes/RoutesInjectionParams';
import * as middlewares from '../../middlewares';
// import * as validator from './validator';
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
    .delete('/:projectName', projectController.deleteProjectByName())
    .delete('/:projectName/:producerService', projectController.removeServiceURL());

  return projectRouter;
};
