import { Project, RemoveServiceFromProject } from './entity';
import sqlProvider from './sql';
import { Database } from '../../database';
import { AbstractCRUDRepository } from '../../common/repository/AbstractCRUDRepository';
import { ProjectQueryProvider } from './ProjectQueryProvider';

export class ProjectRepository extends AbstractCRUDRepository<ProjectQueryProvider> {
  constructor(database: Database) {
    super(database, sqlProvider);
  }

  removeServiceURL(params: RemoveServiceFromProject): Promise<Project[]> {
    return this.database.any(sqlProvider.removeServiceURL, params);
  }
}
