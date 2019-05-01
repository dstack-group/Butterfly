/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    user-manager-rest-api
 * @fileName:  FieldValidationError.ts
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
import { ErrorType, ErrorToJSON } from '../common/errors';
import { ValidationErrorItem } from '../middlewares/ValidationErrorItem';

export type FieldValidationType = 'body' | 'params';

export interface FieldValidationErrorToJSON extends ErrorToJSON {
  fields: ValidationErrorItem[];
  type: FieldValidationType;
}

/**
 * Error thrown when the HTTP request body doesn't respect the expected contract.
 */
export class FieldValidationError extends AppError {
  private fields: ValidationErrorItem[];
  private type: FieldValidationType;

  constructor(message: string, type: FieldValidationType, fields: ValidationErrorItem[]) {
    super({
      code: ErrorType.FIELD_VALIDATION_ERROR,
      errorKey: 'FIELD_VALIDATION_ERROR',
      message,
    });
    this.fields = fields;
    this.type = type;
  }

  /**
   * @Override toJSON method from AppError
   */
  toJSON(): FieldValidationErrorToJSON {
    const json = super.toJSON() as FieldValidationErrorToJSON;
    json.fields = this.fields;
    json.type = this.type;
    return json;
  }
}
