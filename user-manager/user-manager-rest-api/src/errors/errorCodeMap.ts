import * as HTTPStatus from 'http-status-codes';

/**
 * Error codes for internal usage only, which are useful for reports
 */
export enum ErrorType {
  FIELD_VALIDATION_ERROR = 100,
  INTERNAL_SERVER_ERROR = 101,
  NOT_FOUND_ERROR = 102,
  VALIDATION_ERROR = 103,
}

/**
 * Immutable map type specification whose keys are the internal error types, and
 * whose values are the matching HTTP error codes.
 */
export type ErrorCodeMap = {
  readonly [key in keyof typeof ErrorType]: number;
};

export const ERROR_CODE_MAP = {
  FIELD_VALIDATION_ERROR: HTTPStatus.BAD_REQUEST, // 400
  INTERNAL_SERVER_ERROR: HTTPStatus.INTERNAL_SERVER_ERROR, // 500
  NOT_FOUND_ERROR: HTTPStatus.NOT_FOUND, // 404
  VALIDATION_ERROR: HTTPStatus.BAD_REQUEST, // 400
};

export interface ErrorParams {
  code: ErrorType;
  errorKey: keyof typeof ErrorType;
  message: string;
  error?: Error;
}

export function getHTTPStatusFromErrorCode(errorKey: keyof typeof ErrorType) {
  return ERROR_CODE_MAP[errorKey];
}
