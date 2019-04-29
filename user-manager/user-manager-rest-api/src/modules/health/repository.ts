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

import { MetricsProvider } from '../../common/metrics/MetricsProvider';
import { HealthMetrics } from './entity';

export class HealthRepository {
  private metricsProvider: MetricsProvider;

  constructor(metricsProvider: MetricsProvider) {
    this.metricsProvider = metricsProvider;
  }

  async getMetrics(): Promise<HealthMetrics> {
    return new Promise(resolve => {
      const freeMemory = this.metricsProvider.getFreeMemory();
      const platform = this.metricsProvider.getPlatform();
      const uptime = this.metricsProvider.getUptime();

      resolve({
        freeMemory,
        platform,
        uptime,
      });
    });
  }
}
