/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    user-manager-rest-api
 * @fileName:  repository.ts
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

import sqlProvider from './sql';
import { Database } from '../../database';
import { AbstractCRUDRepository } from '../../common/repository/AbstractCRUDRepository';
import { SubscriptionQueryProvider } from './SubscriptionQueryProvider';

export class SubscriptionRepository extends AbstractCRUDRepository<SubscriptionQueryProvider> {
  constructor(database: Database) {
    super(database, sqlProvider);
  }
}
