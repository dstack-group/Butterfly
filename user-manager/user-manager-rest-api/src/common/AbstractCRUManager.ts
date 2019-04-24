import { wrapError, DBError, UniqueViolationError } from 'db-errors';
import { AbstractCRURepository } from './AbstractCRURepository';
import { CRUQueryProvider } from './repository/CRUQueryProvider';
import { Write } from './repository/Write';
import { Read } from './repository/Read';
import { AbstractManager } from './AbstractManager';
import { DBUniqueConstraintError } from '../errors/DBUniqueConstraintError';
import { NotFoundError } from '../errors';

export abstract class AbstractCRUManager
<Provider extends CRUQueryProvider, Repository extends AbstractCRURepository<Provider>>
extends AbstractManager<Repository> implements Write, Read {
  constructor(repository: Repository) {
    super(repository);
  }

  create<P, R>(params: P): Promise<R> {
    return new Promise<R>(async (resolve, reject) => {
      try {
        const result = await this.repository.create<P, R>(params);
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

  find<P, R>(params?: P): Promise<R[]> {
    return this.repository.find(params);
  }

  findOne<P, R>(params: P): Promise<R> {
    return new Promise<R>(async (resolve, reject) => {
      try {
        const result = await this.repository.findOne<P, R>(params);
        if (result === null) {
          throw new NotFoundError('Entity not found');
        }
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  }

  update<P, R>(params: P): Promise<R> {
    return new Promise<R>(async (resolve, reject) => {
      try {
        const result = await this.repository.update<P, R>(params);
        if (result === null) {
          throw new NotFoundError('Entity not found');
        }
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  }
}
