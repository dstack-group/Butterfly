import { AbstractCRURepository } from '../AbstractCRURepository';
import { Delete } from './Delete';
import { CRUDQueryProvider } from './CRUDQueryProvider';

export abstract class AbstractCRUDRepository
<Provider extends CRUDQueryProvider>
extends AbstractCRURepository<Provider> implements Delete {

  async delete<P>(params: P): Promise<boolean> {
    const rowAffected = await this.database.result(this.queryProvider.delete, params);

    const isAtLeastARowAffected = rowAffected > 0;
    return isAtLeastARowAffected;
  }

}
