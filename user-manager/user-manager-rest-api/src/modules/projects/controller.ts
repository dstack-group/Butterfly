import * as HttpStatus from 'http-status-codes';
import { ProjectManager } from './manager';
import { RouteController } from '../../common/controller/RouteController';
import { RouteContextReplierFactory } from '../../router/RouteContextReplierFactory';
import { Project } from './entity';
import { RouteCommand } from '../../router/RouteCommand';
import { Middleware } from '../../router/Router';
import { ThirdPartyProducerService } from '../../common/ThirdPartyProducerService';

export class ProjectController extends RouteController {
  private manager: ProjectManager;

  constructor(routeContextReplierFactory: RouteContextReplierFactory, manager: ProjectManager) {
    super(routeContextReplierFactory);
    this.manager = manager;
  }

  private getProjectsCommand: RouteCommand<Project[]> = async routeContext => {
    /**
     * TODO: pagination
     */
    const projectList = await this.manager.find();
    return {
      data: projectList,
    };
  }

  private createProjectCommand: RouteCommand<Project> = async routeContext => {
    const projectModel = routeContext.getRequestBody() as Project;
    const newProject = await this.manager.create(projectModel);

    return {
      data: newProject,
      status: HttpStatus.CREATED,
    };
  }

  private getProjectByNameCommand: RouteCommand<Project> = async routeContext => {
    const { projectName } = routeContext.getNamedParams() as { projectName: string };
    const projectParams = { projectName };
    const projectFound = await this.manager.findByName(projectParams as Project);

    return {
      data: projectFound,
    };
  }

  private deleteProjectByNameCommand: RouteCommand<Project> = async routeContext => {
    const { projectName } = routeContext.getNamedParams() as { projectName: string };
    const projectParams = { projectName };
    await this.manager.delete(projectParams as Project);

    return {
      data: null,
      status: HttpStatus.OK,
    };
  }

  private removeServiceURLCommand: RouteCommand<Project> = async routeContext => {
    const { projectName, producerService } = routeContext.getNamedParams() as {
      projectName: string,
      producerService: ThirdPartyProducerService,
    };
    const projectParams = { projectName, producerService };
    const project = await this.manager.removeServiceURL(projectParams as Project);

    return {
      data: project,
      status: HttpStatus.OK,
    };
  }

  getProjects(): Middleware {
    return this.execute(this.getProjectsCommand);
  }

  createProject(): Middleware {
    return this.execute(this.createProjectCommand);
  }

  getProjectByName(): Middleware {
    return this.execute(this.getProjectByNameCommand);
  }

  deleteProjectByName(): Middleware {
    return this.execute(this.deleteProjectByNameCommand);
  }

  removeServiceURL(): Middleware {
    return this.execute(this.removeServiceURLCommand);
  }
}
