/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    user-manager-rest-api
 * @fileName:  KoaRouteContext.ts
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

import { Context } from './Router';
import { RouteContextReplier } from './RouteContextReplier';
import { FieldValidationType } from '../errors/FieldValidationError';
import { Validator, ValidationErrorItem, ValidateCallback } from '../common/Validation';
import { FieldValidationError } from '../errors';

/**
 * KoaRouteContext is a RouteContextReplier implementation based on the Koa framework's
 * HTTP request router context.
 */
export class KoaRouteContext implements RouteContextReplier {
  private context: Context;

  constructor(context: Context) {
    this.context = context;
  }

  /**
   * Returns the URL params.
   */
  getNamedParams() {
    return this.context.params;
  }

  /**
   * Returns the validated URL parameters, or throws a ValidationError.
   * @param validateCallback a validation callback that, given a ValidationSchema, checks whether the given
   * named URL parameters matches the expected schema structure.
   */
  getValidatedNamedParams<T>(validateCallback: ValidateCallback): T {
    const params = this.getNamedParams();
    return this.handleValidation(validateCallback, params, 'params');
  }

  /**
   * Returns the query params.
   */
  getQueryParams() {
    return this.context.query;
  }

  /**
   * Returns the request body.
   */
  getRequestBody() {
    return this.context.request.body;
  }

  /**
   * Returns the validated request body, or throws a ValidationError.
   * @param schema a ValidationSchema to check whether the given body matches the expected structure.
   */
  getValidatedRequestBody<T>(validateCallback: ValidateCallback): T {
    const body = this.getRequestBody();
    return this.handleValidation(validateCallback, body, 'body');
  }

  /**
   * Returns the request headers.
   */
  getRequestHeaders(): unknown {
    return this.context.request.headers;
  }

  /**
   * Sets the API response body and response status code.
   * @param body the data inserted into the returned body.
   * @param status the HTTP status code returned.
   */
  reply<T>(body: T, status = 200) {
    this.context.status = status;
    if (status === 204) { // NO_CONTENT
      this.context.body = {};
    } else {
      const isError = status >= 400;

      /**
       * If we're in an error situation, a complete error object has already been built
       * by `errorHandler`, and we must simply return it as it is.
       * If, instead, the response is a successful one, it must be set as the value for the
       * `data` top-level key.
       */
      this.context.body = isError ? body : { data: body };
      this.context.set('Content-Type', 'application/json');
    }
  }

  private handleValidation<T>(validateCallback: ValidateCallback, entity: unknown, type: FieldValidationType): T {
    const schema = validateCallback(Validator);
    const { value, error } = Validator.validate(entity, schema, {
      abortEarly: true,
      allowUnknown: false,
    });

    if (error) {
      const { message, details } = error;
      const fieldErrors: ValidationErrorItem[] = details.map(f => ({
        message: f.message,
        path: f.path,
        type: f.type,
      }));

      throw new FieldValidationError(message, type, fieldErrors);
    }

    return value as T;
  }
}
