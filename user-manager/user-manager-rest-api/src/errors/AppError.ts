import { ErrorParams } from './errorCodeMap';

export interface ErrorToJSON {
  code: ErrorParams['code'];
  message: ErrorParams['message'];
}

export class AppError extends Error {
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
      message: this.message,
    };
  }
}
