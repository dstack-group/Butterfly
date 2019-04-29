/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    user-manager-rest-api
 * @fileName:  ValidationError.ts
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

export class ValidationError extends AppError {
  constructor(message: string) {
    super({
      code: ErrorType.VALIDATION_ERROR,
      errorKey: 'VALIDATION_ERROR',
      message,
    });
  }
}
