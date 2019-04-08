import { AbstractCRUManager } from './AbstractCRUManager';
import { CRUDQueryProvider } from './repository/CRUDQueryProvider';
import { AbstractCRUDRepository } from './repository/AbstractCRUDRepository';
import { Delete } from './repository/Delete';
import { NotFoundError } from '../errors';

export abstract class AbstractCRUDManager
<T, Provider extends CRUDQueryProvider, Repository extends AbstractCRUDRepository<T, Provider>>
extends AbstractCRUManager<T, Provider, Repository> implements Delete<T> {
  constructor(repository: Repository) {
    super(repository);
  }

  async delete(item: T): Promise<boolean> {
    const hasDeletedSomething = await this.repository.delete(item);
    if (!hasDeletedSomething) {
      throw new NotFoundError('Entity not found');
    }

    return hasDeletedSomething;
  }
}
