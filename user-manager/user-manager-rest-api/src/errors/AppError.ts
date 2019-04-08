import { ErrorToJSON, ErrorParams } from '../common/errors';

export abstract class AppError extends Error {
  readonly errorKey: ErrorParams['errorKey'];
  readonly code: ErrorParams['code'];
  readonly error?: ErrorParams['error'];

  constructor({ code, errorKey, message, error }: ErrorParams) {
    super(message);
    this.code = code;
    this.errorKey = errorKey;
    this.error = error;
  }

  toJSON(): ErrorToJSON {
    return {
      code: this.code,
      error: true,
      message: this.message,
    };
  }
}
