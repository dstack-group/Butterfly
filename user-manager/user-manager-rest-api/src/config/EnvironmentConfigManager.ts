/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    user-manager-rest-api
 * @fileName:  EnvironmentConfigManager.ts
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

import { AbstractConfigManager } from './AbstractConfigManager';

/**
 * EnvironmentConfigManager gives the user the possibility to read configuration properties among the environment
 * variables, setting default values and explicitly cast them to the following types:
 * - String;
 * - Integer;
 * - Boolean;
 * In case of errors, an instance of `ConfigurationException` is thrown.
 */
export class EnvironmentConfigManager extends AbstractConfigManager {
  protected readConfigValue(property: string): string | undefined {
    return process.env[property];
  }
}
