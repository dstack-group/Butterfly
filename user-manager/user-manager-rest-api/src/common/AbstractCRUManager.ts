import { wrapError, DBError, UniqueViolationError } from 'db-errors';
import { AbstractCRURepository } from './AbstractCRURepository';
import { CRUQueryProvider } from './repository/CRUQueryProvider';
import { Write } from './repository/Write';
import { Read } from './repository/Read';
import { AbstractManager } from './AbstractManager';
import { DBUniqueConstraintError } from '../errors/DBUniqueConstraintError';

export abstract class AbstractCRUManager
<T, Provider extends CRUQueryProvider, Repository extends AbstractCRURepository<T, Provider>>
extends AbstractManager<Repository> implements Write<T>, Read<T> {
  constructor(repository: Repository) {
    super(repository);
  }

  create(item: T): Promise<T> {
    return new Promise<T>(async (resolve, reject) => {
      try {
        const result = await this.repository.create(item);
        resolve(result);
      } catch (error) {
        const dbError: DBError = wrapError(error);

        if (dbError instanceof UniqueViolationError) {
          reject(new DBUniqueConstraintError());
        } else {
          // unknown error
          reject(error);
        }
      }
    });
  }

  find<V>(params?: V): Promise<T[]> {
    return this.repository.find(params);
  }

  findOne(item: T): Promise<T> {
    return this.repository.findOne(item);
  }

  update(item: T): Promise<T> {
    return this.repository.update(item);
  }
}
