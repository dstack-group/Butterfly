/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    user-manager-rest-api
 * @fileName:  ConfigurationCastException.ts
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

import { ConfigurationException } from './ConfigurationException';

export class ConfigurationCastException extends ConfigurationException {
  constructor(property: string, value: string, type: string) {
    const message = `Cannot cast the property ${property} of value ${value} to type ${type}`;
    super(message);
  }
}
