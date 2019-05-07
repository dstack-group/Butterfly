/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    slack-account-configurator
 * @fileName:  RequestParams.ts
 * @created:   2019-05-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

export interface RequestParams {
  endpoint: string;
  method: 'GET' |
    'POST' |
    'PATCH' |
    'PUT' |
    'DELETE';
  body?: {};
}
