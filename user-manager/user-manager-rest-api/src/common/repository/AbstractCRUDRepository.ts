/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    user-manager-rest-api
 * @fileName:  AbstractCRUDRepository.ts
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

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
