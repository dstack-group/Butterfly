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
