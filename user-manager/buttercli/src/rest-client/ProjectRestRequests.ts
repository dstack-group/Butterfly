import { Project, CreateProject, FindProject} from './entities/ProjectEntities';
import { UpdateProject, RemoveProject } from './entities/ProjectEntities';
import { RestRequestsManager, HttpMethod } from './RestRequestsManager';
import { ServerConfig } from '../database/ServerConfig';

export class ProjectRestRequests {

  private manager: RestRequestsManager;
  private path: string;

  constructor(serverConfig: ServerConfig) {
    this.manager = new RestRequestsManager(serverConfig);
    this.path = 'projects';
  }

  create(project: CreateProject): Promise<Project> {
    return this.manager.submitRequest<Project>(this.path, HttpMethod.POST, project);
  }

  update(project: UpdateProject): Promise<Project> {
    const {projectName, ...payload} = project;
    return this.manager.submitRequest<Project>(`${this.path}/${project.projectName}`, HttpMethod.PUT, payload);
  }

  find(project: FindProject): Promise<Project> {
    return this.manager.submitRequest<Project>(`${this.path}/${project.projectName}`, HttpMethod.GET);
  }

  findAll(): Promise<Project[]> {
    return this.manager.submitRequest<Project[]>(this.path, HttpMethod.GET);
  }

  remove(project: RemoveProject): Promise<void> {
    return (project.service === undefined) ?
      this.manager.submitRequest<void>(`${this.path}/${project.projectName}`, HttpMethod.DELETE) :
      this.manager.submitRequest<void>(`${this.path}/${project.projectName}/${project.service}`, HttpMethod.DELETE);
  }
}
