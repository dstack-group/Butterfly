/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    user-manager-rest-api
 * @fileName:  ParseSyntaxError.ts
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

import { AppError } from './AppError';
import { ErrorType } from '../common/errors';

/**
 * Error thrown when the payload isn't a valid JSON object
 */
export class ParseSyntaxError extends AppError {
  constructor(element: 'body' | 'params') {
    super({
      code: ErrorType.PARSE_SYNTAX_ERROR,
      errorKey: 'PARSE_SYNTAX_ERROR',
      message: `Invalid syntax in the HTTP request ${element}.`,
    });
  }
}
