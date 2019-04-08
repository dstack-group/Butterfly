import { AppError } from './AppError';
import { ErrorType, ErrorToJSON } from '../common/errors';
import { ValidationErrorItem } from '../middlewares/ValidationErrorItem';

export interface FieldValidationErrorToJSON extends ErrorToJSON {
  fields: ValidationErrorItem[];
}

/**
 * Error thrown when the HTTP request body doesn't respect the expected contract.
 */
export class FieldValidationError extends AppError {
  private fields: ValidationErrorItem[];

  constructor(message: string, fields: ValidationErrorItem[]) {
    super({
      code: ErrorType.FIELD_VALIDATION_ERROR,
      errorKey: 'FIELD_VALIDATION_ERROR',
      message,
    });
    this.fields = fields;
  }

  /**
   * @Override toJSON method from AppError
   */
  toJSON(): FieldValidationErrorToJSON {
    const json = super.toJSON() as FieldValidationErrorToJSON;
    json.fields = this.fields;
    return json;
  }
}
