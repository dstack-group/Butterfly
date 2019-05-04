/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    user-manager-rest-api
 * @fileName:  errors.spec.ts
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

import { ErrorType } from '../../src/common/errors';
import {
  ValidationError,
  NotFoundError,
  ParseSyntaxError,
  getHTTPStatusFromErrorCode,
} from '../../src/errors';
import { DBUniqueConstraintError } from '../../src/errors/DBUniqueConstraintError';

describe(`Application errors`, () => {
  it(`ValidationError's JSON has the correct structure and error message`, () => {
    const notFoundErrorMessage = 'validation message';
    const validationMessage = new ValidationError(notFoundErrorMessage);
    const validationMessageJSON = validationMessage.toJSON();
    expect(validationMessageJSON).toEqual({
      code: ErrorType.VALIDATION_ERROR,
      error: true,
      message: notFoundErrorMessage,
    });
  });

  it(`NotFoundError's JSON has the correct structure and error message`, () => {
    const notFoundErrorMessage = 'not found message';
    const notFoundError = new NotFoundError(notFoundErrorMessage);
    const notFoundErrorJSON = notFoundError.toJSON();
    expect(notFoundErrorJSON).toEqual({
      code: ErrorType.NOT_FOUND_ERROR,
      error: true,
      message: notFoundErrorMessage,
    });
  });

  it(`ParseSyntaxError's JSON has the correct structure and error message`, () => {
    const syntaxErrorBody = new ParseSyntaxError('body');
    const syntaxErrorBodyJSON = syntaxErrorBody.toJSON();
    expect(syntaxErrorBodyJSON).toEqual({
      code: ErrorType.PARSE_SYNTAX_ERROR,
      error: true,
      message: 'Invalid syntax in the HTTP request body.',
    });

    const syntaxErrorParams = new ParseSyntaxError('params');
    const syntaxErrorParamsJSON = syntaxErrorParams.toJSON();
    expect(syntaxErrorParamsJSON).toEqual({
      code: ErrorType.PARSE_SYNTAX_ERROR,
      error: true,
      message: 'Invalid syntax in the HTTP request params.',
    });
  });

  it(`DBUniqueConstraintError's JSON has the correct structure and error message`, () => {
    const uniqueConstraintError = new DBUniqueConstraintError();
    const uniqueConstraintErrorJSON = uniqueConstraintError.toJSON();
    expect(uniqueConstraintErrorJSON).toEqual({
      code: ErrorType.UNIQUE_CONSTRAINT_ERROR,
      error: true,
      message: uniqueConstraintError.message,
    });
  });

  it(`getHTTPStatusFromErrorCode should map internal code errors to HTTP error codes`, () => {
    expect(getHTTPStatusFromErrorCode('FIELD_VALIDATION_ERROR')).toBe(422);
    expect(getHTTPStatusFromErrorCode('INTERNAL_SERVER_ERROR')).toBe(500);
    expect(getHTTPStatusFromErrorCode('NOT_FOUND_ERROR')).toBe(404);
    expect(getHTTPStatusFromErrorCode('VALIDATION_ERROR')).toBe(400);
    expect(getHTTPStatusFromErrorCode('UNIQUE_CONSTRAINT_ERROR')).toBe(409);
  });
});
