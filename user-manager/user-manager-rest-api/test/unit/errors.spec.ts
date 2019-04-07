import { ValidationError, ErrorType, NotFoundError, getHTTPStatusFromErrorCode } from '../../src/errors';

describe(`Application errors`, () => {
  it(`ValidationError's JSON has the properties code, errorKey, message`, () => {
    const notFoundErrorMessage = 'validation message';
    const validationMessage = new ValidationError(notFoundErrorMessage);
    const validationMessageJSON = validationMessage.toJSON();
    expect(validationMessageJSON).toHaveProperty('code');
    expect(validationMessageJSON).toHaveProperty('message');
    expect(validationMessageJSON).toEqual({
      code: ErrorType.VALIDATION_ERROR,
      message: notFoundErrorMessage,
    });
  });

  it(`ValidationError's JSON has the properties code, errorKey, message`, () => {
    const notFoundErrorMessage = 'not found message';
    const notFoundError = new NotFoundError(notFoundErrorMessage);
    const notFoundErrorJSON = notFoundError.toJSON();
    expect(notFoundErrorJSON).toHaveProperty('code');
    expect(notFoundErrorJSON).toHaveProperty('message');
    expect(notFoundErrorJSON).toEqual({
      code: ErrorType.NOT_FOUND_ERROR,
      message: notFoundErrorMessage,
    });
  });

  it(`getHTTPStatusFromErrorCode should map internal code errors to HTTP error codes`, () => {
    expect(getHTTPStatusFromErrorCode('FIELD_VALIDATION_ERROR')).toBe(400);
    expect(getHTTPStatusFromErrorCode('INTERNAL_SERVER_ERROR')).toBe(500);
    expect(getHTTPStatusFromErrorCode('NOT_FOUND_ERROR')).toBe(404);
    expect(getHTTPStatusFromErrorCode('VALIDATION_ERROR')).toBe(400);
  })
});
