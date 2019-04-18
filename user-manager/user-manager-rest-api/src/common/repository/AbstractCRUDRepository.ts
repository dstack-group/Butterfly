import { AbstractCRURepository } from '../AbstractCRURepository';
import { Delete } from './Delete';
import { CRUDQueryProvider } from './CRUDQueryProvider';

export abstract class AbstractCRUDRepository
<T, Provider extends CRUDQueryProvider>
extends AbstractCRURepository<T, Provider> implements Delete {

  async delete<V>(item: V): Promise<boolean> {
    const rowAffected = await this.database.result(this.queryProvider.delete, item);

    const isAtLeastARowAffected = rowAffected > 0;
    return isAtLeastARowAffected;
  }

}
