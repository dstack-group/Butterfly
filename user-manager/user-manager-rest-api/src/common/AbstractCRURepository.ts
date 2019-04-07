import { Database } from '../database';
import { Read } from './repository/Read';
import { Write } from './repository/Write';
import { CRUQueryProvider } from './repository/CRUQueryProvider';

export abstract class AbstractCRURepository
<T, Provider extends CRUQueryProvider> implements Read<T>, Write<T> {

  protected database: Database;
  protected queryProvider: Provider;

  constructor(database: Database, queryProvider: Provider) {
    this.database = database;
    this.queryProvider = queryProvider;
  }

  find<V>(params: V): Promise<T[]> {
    return this.database.any(this.queryProvider.find, params);
  }

  findOne(item: T): Promise<T> {
    return this.database.one(this.queryProvider.findOne, item);
  }

  create(item: T): Promise<T> {
    return this.database.one(this.queryProvider.create, item);
  }

  update(item: T): Promise<T> {
    return this.database.one(this.queryProvider.update, item);
  }
}
