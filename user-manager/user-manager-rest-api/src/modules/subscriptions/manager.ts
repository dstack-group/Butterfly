/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    user-manager-rest-api
 * @fileName:  manager.ts
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

import { SubscriptionRepository } from './repository';
import { AbstractCRUDManager } from '../../common/AbstractCRUDManager';

export class SubscriptionManager extends AbstractCRUDManager<any, SubscriptionRepository> {
  constructor(repository: SubscriptionRepository) {
    super(repository);
  }
}
