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

import { UserContactRepository } from './repository';
import { AbstractCRUDManager } from '../../common/AbstractCRUDManager';

export class UserContactManager extends AbstractCRUDManager<any, UserContactRepository> {
  constructor(repository: UserContactRepository) {
    super(repository);
  }
}
