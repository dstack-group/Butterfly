/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    user-manager-rest-api
 * @fileName:  AbstractCRURepository.ts
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

import { Database } from '../database';
import { Read } from './repository/Read';
import { Write } from './repository/Write';
import { CRUQueryProvider } from './repository/CRUQueryProvider';

export abstract class AbstractCRURepository
<Provider extends CRUQueryProvider> implements Read, Write {

  protected database: Database;
  protected queryProvider: Provider;

  constructor(database: Database, queryProvider: Provider) {
    this.database = database;
    this.queryProvider = queryProvider;
  }

  find<P, R>(params: P): Promise<R[]> {
    return this.database.any(this.queryProvider.find, params);
  }

  findOne<P, R>(params: P): Promise<R|null> {
    return this.database.one(this.queryProvider.findOne, params);
  }

  create<P, R>(params: P): Promise<R> {
    return this.database.one(this.queryProvider.create, params) as Promise<R>;
  }

  update<P, R>(params: P): Promise<R|null> {
    return this.database.one(this.queryProvider.update, params);
  }
}
