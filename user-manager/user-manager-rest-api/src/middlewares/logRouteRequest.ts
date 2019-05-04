/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    user-manager-rest-api
 * @fileName:  logRouteRequest.ts
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

import { BAD_REQUEST } from 'http-status-codes';
import { Middleware } from '../router/Router';
import { Logger } from '../logger';

/**
 * Utility middleware that logs each request.
 * @param logger
 */
export function logRouteRequest(logger: Logger): Middleware {
  return async (ctx, next) => {
    const start = Date.now();
    await next();

    const message = `[${ctx.status}] ${ctx.method} ${ctx.path}`;
    const dataToLog = {
      method: ctx.method,
      path: ctx.path,
      statusCode: ctx.status,
      timeMs: Date.now() - start,
    };

    if (ctx.status >= BAD_REQUEST) {
      logger.error(message, dataToLog, ctx.body);
    } else {
      logger.info(message, dataToLog);
    }
  };
}
