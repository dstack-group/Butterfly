import { AbstractCRURepository } from '../AbstractCRURepository';
import { Delete } from './Delete';
import { CRUDQueryProvider } from './CRUDQueryProvider';

export abstract class AbstractCRUDRepository
<T, Provider extends CRUDQueryProvider>
extends AbstractCRURepository<T, Provider> implements Delete<T> {

  async delete(item: T): Promise<boolean> {
    const result = await this.database.result(this.queryProvider.delete, item);
    const isAtLeastARowAffected = result > 0;
    return isAtLeastARowAffected;
  }

}
