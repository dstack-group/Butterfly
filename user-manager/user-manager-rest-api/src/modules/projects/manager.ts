import { Project } from './entity';
import { ProjectRepository } from './repository';
import { AbstractCRUDManager } from '../../common/AbstractCRUDManager';
import { NotFoundError } from '@src/errors';

export class ProjectManager extends AbstractCRUDManager<Project, any, ProjectRepository> {

  constructor(repository: ProjectRepository) {
    super(repository);
  }

  findByName(project: Project): Promise<Project> {
    return this.repository.findByName(project);
  }

  async removeServiceURL(project: Project): Promise<Project> {
    const result = await this.repository.removeServiceURL(project);
    if (result.length === 0) {
      throw new NotFoundError('Project entity not found');
    } else {
      return result[0];
    }
  }
}
