/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    user-manager-rest-api
 * @fileName:  NotFoundError.ts
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
 * Error thrown when a certain resource doesn't exist.
 */
export class NotFoundError extends AppError {
  constructor(message: string) {
    super({
      code: ErrorType.NOT_FOUND_ERROR,
      errorKey: 'NOT_FOUND_ERROR',
      message,
    });
  }
}
