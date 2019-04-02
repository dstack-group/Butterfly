import { AbstractCRURepository } from '../AbstractCRURepository';
import { Delete } from './Delete';
import { CRUDQueryProvider } from './CRUDQueryProvider';

export abstract class AbstractCRUDRepository
<T, Provider extends CRUDQueryProvider>
extends AbstractCRURepository<T, Provider> implements Delete<T> {

  async delete(item: T): Promise<boolean> {
    const result = await this.database.one(this.queryProvider.delete, item);
    return true; // TODO: return true only if it's been deleted
  }

}
