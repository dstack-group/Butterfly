/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    user-manager-rest-api
 * @fileName:  ErrorToJSON.ts
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

import { ErrorParams } from './ErrorParams';

export interface ErrorToJSON {
  code: ErrorParams['code'];
  error: true;
  message: ErrorParams['message'];
}
