/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    user-manager-rest-api
 * @fileName:  controller.ts
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

import * as HttpStatus from 'http-status-codes';
import { ProjectManager } from './manager';
import { RouteController } from '../../common/controller/RouteController';
import { RouteContextReplierFactory } from '../../router/RouteContextReplierFactory';
import {
  Project,
  CreateProject,
  ProjectName,
  RemoveServiceFromProject,
  UpdateProjectBody,
  UpdateProject,
} from './entity';
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
    const projectList = await this.manager.find<undefined, Project>();
    return {
      data: projectList,
      status: HttpStatus.OK,
    };
  }

  private createProjectCommand: RouteCommand<Project> = async routeContext => {
    const projectModel = routeContext.getRequestBody() as CreateProject;
    const newProject = await this.manager.create<CreateProject, Project>(projectModel);

    return {
      data: newProject,
      status: HttpStatus.CREATED,
    };
  }

  private getProjectByNameCommand: RouteCommand<Project> = async routeContext => {
    const { projectName } = routeContext.getNamedParams() as { projectName: string };
    const projectParams: ProjectName = { projectName };
    const projectFound = await this.manager.findOne<ProjectName, Project>(projectParams);

    return {
      data: projectFound,
      status: HttpStatus.OK,
    };
  }

  private updateProjectByNameCommand: RouteCommand<Project> = async routeContext => {
    const { projectName } = routeContext.getNamedParams() as { projectName: string };
    const projectModel = routeContext.getRequestBody() as UpdateProjectBody;
    const projectParams: UpdateProject = { ...projectModel, projectName };
    const projectUpdated = await this.manager.update<UpdateProjectBody, Project>(projectParams);

    return {
      data: projectUpdated,
      status: HttpStatus.OK,
    };
  }

  private deleteProjectByNameCommand: RouteCommand<Project> = async routeContext => {
    const { projectName } = routeContext.getNamedParams() as { projectName: string };
    const projectParams: ProjectName = { projectName };
    await this.manager.delete<ProjectName>(projectParams);

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
    const projectParams: RemoveServiceFromProject = { projectName, producerService };
    const project = await this.manager.removeServiceURL(projectParams);

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

  updateProjectByName(): Middleware {
    return this.execute(this.updateProjectByNameCommand);
  }

  deleteProjectByName(): Middleware {
    return this.execute(this.deleteProjectByNameCommand);
  }

  removeServiceURL(): Middleware {
    return this.execute(this.removeServiceURLCommand);
  }
}
