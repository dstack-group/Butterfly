/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    slack-account-configurator
 * @fileName:  Log.ts
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

import pino from 'pino';
import { Logger } from './Logger';

/**
 * Logger implementation that acts as an Adapter for the `pino` logger.
 */
export class Log implements Logger {
  private logger: pino.Logger;

  constructor() {
    this.logger = pino();
  }

  error(message: string, ...params: unknown[]) {
    this.logger.error(message, params);
  }

  info(message: string, ...params: unknown[]) {
    this.logger.info(message, params);
  }
}
