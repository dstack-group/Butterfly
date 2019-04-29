/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    user-manager-rest-api
 * @fileName:  TestLogger.ts
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

import { Logger } from '../src/logger';

export class TestLogger implements Logger {
  error(message: string, ...params: any[]) {
    // empty
  }

  info(message: string, ...params: any[]) {
    // empty
  }
}
