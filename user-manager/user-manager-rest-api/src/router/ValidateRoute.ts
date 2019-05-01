/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    user-manager-rest-api
 * @fileName:  ValidateRoute.ts
 * @created:   2019-04-30
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

import { ValidateCallback } from '../common/Validation';

/**
 * ValidateRoute defines the structure of the methods used to retrieve validated named params
 * and request body.
 */
export interface ValidateRoute {
  /**
   * Returns the validated URL parameters, or throws a ValidationError.
   * @param validateCallback a validation callback that, given a ValidationSchema, checks whether the given
   * named URL parameters matches the expected schema structure.
   */
  getValidatedNamedParams<T>(validateCallback: ValidateCallback): T;

  /**
   * Returns the validated request body, or throws a ValidationError.
   * @param validateCallback a validation callback that, given a ValidationSchema, checks whether the given
   * request body matches the expected schema structure.
   */
  getValidatedRequestBody<T>(validateCallback: ValidateCallback): T;
}
