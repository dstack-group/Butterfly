import { AbstractCRUManager } from './AbstractCRUManager';
import { CRUDQueryProvider } from './repository/CRUDQueryProvider';
import { AbstractCRUDRepository } from './repository/AbstractCRUDRepository';
import { Delete } from './repository/Delete';

export abstract class AbstractCRUDManager
<T, Provider extends CRUDQueryProvider, Repository extends AbstractCRUDRepository<T, Provider>>
extends AbstractCRUManager<T, Provider, Repository> implements Delete<T> {
  constructor(repository: Repository) {
    super(repository);
  }

  delete(item: T): Promise<boolean> {
    return this.repository.delete(item);
  }
}
