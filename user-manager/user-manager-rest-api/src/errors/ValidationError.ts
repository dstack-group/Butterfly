import { AppError } from './AppError';
import { ErrorType } from './errorCodeMap';

export class ValidationError extends AppError {
  constructor(message: string) {
    super({
      code: ErrorType.VALIDATION_ERROR,
      errorKey: 'VALIDATION_ERROR',
      message,
    });
  }
}
