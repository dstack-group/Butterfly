/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    user-manager-rest-api
 * @fileName:  AbstractCRUDManager.ts
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

import { AbstractCRUManager } from './AbstractCRUManager';
import { CRUDQueryProvider } from './repository/CRUDQueryProvider';
import { AbstractCRUDRepository } from './repository/AbstractCRUDRepository';
import { Delete } from './repository/Delete';
import { NotFoundError } from '../errors';

export abstract class AbstractCRUDManager
<Provider extends CRUDQueryProvider, Repository extends AbstractCRUDRepository<Provider>>
extends AbstractCRUManager<Provider, Repository> implements Delete {
  constructor(repository: Repository) {
    super(repository);
  }

  async delete<P>(params: P): Promise<boolean> {
    const hasDeletedSomething = await this.repository.delete(params);
    if (!hasDeletedSomething) {
      throw new NotFoundError('Entity not found');
    }

    return hasDeletedSomething;
  }
}
