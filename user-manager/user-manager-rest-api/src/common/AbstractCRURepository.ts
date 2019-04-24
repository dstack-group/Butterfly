import { Database } from '../database';
import { Read } from './repository/Read';
import { Write } from './repository/Write';
import { CRUQueryProvider } from './repository/CRUQueryProvider';

export abstract class AbstractCRURepository
<Provider extends CRUQueryProvider> implements Read, Write {

  protected database: Database;
  protected queryProvider: Provider;

  constructor(database: Database, queryProvider: Provider) {
    this.database = database;
    this.queryProvider = queryProvider;
  }

  find<P, R>(params: P): Promise<R[]> {
    return this.database.any(this.queryProvider.find, params);
  }

  findOne<P, R>(params: P): Promise<R|null> {
    return this.database.one(this.queryProvider.findOne, params);
  }

  create<P, R>(params: P): Promise<R> {
    return this.database.one(this.queryProvider.create, params) as Promise<R>;
  }

  update<P, R>(params: P): Promise<R|null> {
    return this.database.one(this.queryProvider.update, params);
  }
}
