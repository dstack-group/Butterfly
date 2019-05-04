/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    user-manager-rest-api
 * @fileName:  bodyParser.ts
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

import koaBodyParser from 'koa-bodyparser';
import { Middleware } from '../router/Router';
import { ParseSyntaxError } from '../errors/ParseSyntaxError';

/**
 * Middleware that adds the possibility to parse the body of
 * PUT, POST, PATCH HTTP requests.
 */
export function bodyParser(): Middleware {
  return koaBodyParser({
    enableTypes: ['json'],
    onerror: () => {
      throw new ParseSyntaxError('body');
    },
    strict: true,
  });
}
