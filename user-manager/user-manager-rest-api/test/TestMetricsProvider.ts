/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    user-manager-rest-api
 * @fileName:  TestMetricsProvider.ts
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

import { MetricsProvider } from '../src/common/metrics/MetricsProvider';

export class TestMetricsProvider implements MetricsProvider {
  getUptime() {
    return 1000;
  }

  getPlatform() {
    return 'TEST_PLATFORM';
  }

  getFreeMemory() {
    return 2000;
  }
}
