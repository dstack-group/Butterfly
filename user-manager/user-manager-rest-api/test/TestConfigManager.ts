/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    user-manager-rest-api
 * @fileName:  TestConfigManager.ts
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

import { AbstractConfigManager } from '../src/config';

export class TestConfigManager extends AbstractConfigManager {
  private configMap = new Map<string, string>();

  protected readConfigValue(property: string): string | undefined {
    return this.configMap.get(property);
  }

  setProperty(property: string, value: string) {
    this.configMap.set(property, value);
  }
}
