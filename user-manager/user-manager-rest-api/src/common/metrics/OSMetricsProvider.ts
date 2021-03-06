/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    user-manager-rest-api
 * @fileName:  OSMetricsProvider.ts
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

import * as os from 'os';
import { MetricsProvider } from './MetricsProvider';

export class OSMetricsProvider implements MetricsProvider {
  /**
   * Returns the aliveness time of the application in milliseconds.
   */
  getUptime(): number {
    return os.uptime();
  }

  /**
   * Returns the system platform where the application runs.
   */
  getPlatform(): string {
    return os.platform().toString();
  }

  /**
   * Returns the amount of free memory available to the application.
   */
  getFreeMemory(): number {
    return os.freemem();
  }
}
