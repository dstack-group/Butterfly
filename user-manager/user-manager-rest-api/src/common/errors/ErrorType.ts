/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    user-manager-rest-api
 * @fileName:  ErrorType.ts
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

/**
 * Error codes for internal usage only, which are useful for reports.
 */
export enum ErrorType {
  FIELD_VALIDATION_ERROR = 100,
  INTERNAL_SERVER_ERROR = 101,
  NOT_FOUND_ERROR = 102,
  VALIDATION_ERROR = 103,
  UNIQUE_CONSTRAINT_ERROR = 200,
}
