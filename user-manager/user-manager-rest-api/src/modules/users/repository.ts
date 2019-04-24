import sqlProvider from './sql';
import { Database } from '../../database';
import { AbstractCRUDRepository } from '../../common/repository/AbstractCRUDRepository';
import { UserQueryProvider } from './UserQueryProvider';

export class UserRepository extends AbstractCRUDRepository<UserQueryProvider> {
  constructor(database: Database) {
    super(database, sqlProvider);
  }
}
