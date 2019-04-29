/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    user-manager-rest-api
 * @fileName:  ErrorParams.ts
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

import { ErrorType } from './ErrorType';

export interface ErrorParams {
  code: ErrorType;
  errorKey: keyof typeof ErrorType;
  message: string;
  error?: Error;
}
