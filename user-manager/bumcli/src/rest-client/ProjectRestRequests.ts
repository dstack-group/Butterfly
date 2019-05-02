import { Project, CreateProject, FindProject} from './entities/ProjectEntities';
import { UpdateProject, RemoveProject } from './entities/ProjectEntities';
import { RestRequests, HttpMethod } from './RestRequests';
import { ServerConfig } from '../database/ServerConfig';

export class ProjectRestRequests extends RestRequests {

  private path: string;

  constructor(serverConfig: ServerConfig) {
    super(serverConfig);
    this.path = 'projects';
  }

  create(project: CreateProject): Promise<Project> {
    return this.submitRequest<Project>(this.path, HttpMethod.POST, project);
  }

  update(project: UpdateProject): Promise<Project> {
    return this.submitRequest<Project>(`${this.path}/${project.name}`, HttpMethod.PATCH, project);
  }

  find(project: FindProject): Promise<Project> {
    return this.submitRequest<Project>(`${this.path}/${project.name}`, HttpMethod.GET);
  }

  findAll(): Promise<Project[]> {
    return this.submitRequest<Project[]>(this.path, HttpMethod.GET);
  }

  remove(project: RemoveProject): Promise<void> {
    return (project.service === undefined) ?
      this.submitRequest<void>(`${this.path}/${project.name}`, HttpMethod.DELETE) :
      this.submitRequest<void>(`${this.path}/${project.name}/${project.service}`, HttpMethod.DELETE);
  }
}
