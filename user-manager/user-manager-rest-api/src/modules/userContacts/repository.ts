import { UserContact } from './entity';
import sqlProvider from './sql';
import { Database } from '../../database';
import { AbstractCRUDRepository } from '../../common/repository/AbstractCRUDRepository';
import { UserContactQueryProvider } from './UserContactQueryProvider';

export class UserContactRepository extends AbstractCRUDRepository<UserContact, UserContactQueryProvider> {
  constructor(database: Database) {
    super(database, sqlProvider);
  }
}
