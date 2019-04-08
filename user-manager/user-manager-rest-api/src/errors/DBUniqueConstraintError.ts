import { AppError } from './AppError';
import { ErrorType } from '../common/errors';

/**
 * Error thrown when a certain resource doesn't exist.
 */
export class DBUniqueConstraintError extends AppError {
  constructor() {
    super({
      code: ErrorType.UNIQUE_CONSTRAINT_ERROR,
      errorKey: 'UNIQUE_CONSTRAINT_ERROR',
      message: 'Unique constraint violation',
    });
  }
}
