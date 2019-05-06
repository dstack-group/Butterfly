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

import { AbstractManager } from '../../common/AbstractManager';
import { HealthRepository } from './repository';
import { HealthMetrics } from './entity';

export class HealthManager extends AbstractManager<HealthRepository> {
  constructor(repository: HealthRepository) {
    super(repository);
  }

  getMetrics(): Promise<HealthMetrics> {
    return this.repository.getMetrics();
  }
}
