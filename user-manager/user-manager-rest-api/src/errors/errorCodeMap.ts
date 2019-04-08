import * as HTTPStatus from 'http-status-codes';
import { ErrorType } from '../common/errors';

/**
 * Immutable map type specification whose keys are the internal error types, and
 * whose values are the matching HTTP error codes.
 */
export type ErrorCodeMap = {
  readonly [key in keyof typeof ErrorType]: number;
};

export const ERROR_CODE_MAP: ErrorCodeMap = {
  FIELD_VALIDATION_ERROR: HTTPStatus.BAD_REQUEST, // 400
  INTERNAL_SERVER_ERROR: HTTPStatus.INTERNAL_SERVER_ERROR, // 500
  NOT_FOUND_ERROR: HTTPStatus.NOT_FOUND, // 404
  UNIQUE_CONSTRAINT_ERROR: HTTPStatus.CONFLICT, // 409
  VALIDATION_ERROR: HTTPStatus.BAD_REQUEST, // 400
};

export function getHTTPStatusFromErrorCode(errorKey: keyof typeof ErrorType) {
  return ERROR_CODE_MAP[errorKey];
}
