/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    user-manager-rest-api
 * @fileName:  MetricsProvider.ts
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

/**
 * Contract that a class that monitors system resources must implement.
 */
export interface MetricsProvider {
  /**
   * Returns the aliveness time of the application in milliseconds.
   */
  getUptime(): number;

  /**
   * Returns the system platform where the application runs.
   */
  getPlatform(): string;

  /**
   * Returns the amount of free memory available to the application.
   */
  getFreeMemory(): number;
}
