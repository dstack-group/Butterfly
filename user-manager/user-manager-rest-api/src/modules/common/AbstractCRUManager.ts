import { AbstractCRURepository } from './AbstractCRURepository';
import { CRUQueryProvider } from './repository/CRUQueryProvider';
import { Write } from './repository/Write';
import { Read } from './repository/Read';

export abstract class AbstractCRUManager
<T, Provider extends CRUQueryProvider, Repository extends AbstractCRURepository<T, Provider>>
implements Write<T>, Read<T> {

  protected repository: Repository;

  constructor(repository: Repository) {
    this.repository = repository;
  }

  create(item: T): Promise<T> {
    return this.repository.create(item);
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
