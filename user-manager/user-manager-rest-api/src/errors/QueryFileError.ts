/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    user-manager-rest-api
 * @fileName:  QueryFileError.ts
 * @created:   2019-04-30
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

export class QueryFileError extends Error {
  constructor(fullPath: string, error: Error) {
    super(`Cannot read SQL file ${fullPath}. Original error: ${error}`);
  }
}
