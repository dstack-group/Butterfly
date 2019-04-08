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
