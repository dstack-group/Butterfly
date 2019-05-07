/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    slack-account-configurator
 * @fileName:  ConfigurationUndefinedException.ts
 * @created:   2019-05-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

import { ConfigurationException } from './ConfigurationException';

export class ConfigurationUndefinedException extends ConfigurationException {
  constructor(property: string) {
    const message = `The property ${property} is null, but it should have at least a default value.`;
    super(message);
  }
}
