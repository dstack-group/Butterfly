import { Project, ProjectName, RemoveServiceFromProject } from './entity';
import { ProjectRepository } from './repository';
import { AbstractCRUDManager } from '../../common/AbstractCRUDManager';
import { NotFoundError } from '../../errors';

export class ProjectManager extends AbstractCRUDManager<Project, any, ProjectRepository> {

  constructor(repository: ProjectRepository) {
    super(repository);
  }

  async removeServiceURL(params: RemoveServiceFromProject): Promise<Project> {
    const result = await this.repository.removeServiceURL(params);
    if (result.length === 0) {
      throw new NotFoundError('Project entity not found');
    } else {
      return result[0];
    }
  }
}
