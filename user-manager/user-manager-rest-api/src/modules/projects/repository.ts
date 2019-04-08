import { Project } from './entity';
import sqlProvider from './sql';
import { Database } from '../../database';
import { AbstractCRUDRepository } from '../../common/repository/AbstractCRUDRepository';
import { ProjectQueryProvider } from './ProjectQueryProvider';

export class ProjectRepository extends AbstractCRUDRepository<Project, ProjectQueryProvider> {
  constructor(database: Database) {
    super(database, sqlProvider);
  }

  findByName(project: Project): Promise<Project> {
    return this.database.one(sqlProvider.findOne, project);
  }

  removeServiceURL(project: Project): Promise<Project[]> {
    return this.database.any(sqlProvider.removeServiceURL, project);
  }
}
