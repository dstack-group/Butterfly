/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    slack-account-configurator
 * @fileName:  UserManagerClient.ts
 * @created:   2019-05-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

import { HTTPRequestHelper } from './HTTPRequestHelper';
import { RequestParams } from './RequestParams';
import { CreateUserContactBody } from './entities/CreateUserContactBody';
import { UserManagerClientConfig } from './UserManagerClientConfig';
import { UserManagerHTTPClient } from './interfaces/UserManagerHTTPClient';

/**
 * UserManagerClient exposes methods to perform CRUD operations against
 * the User Manager module via its REST APIs.
 */
export class UserManagerClient implements UserManagerHTTPClient {
  private requestHelper: HTTPRequestHelper;

  constructor(config: UserManagerClientConfig) {
    this.requestHelper = new HTTPRequestHelper(config.baseURL, config.timeout);
  }

  private handleRequest<T>(params: RequestParams): Promise<T> {
    return this.requestHelper.submitRequest<T>(params);
  }

  createUserContact(body: CreateUserContactBody) {
    return this.handleRequest<unknown>({
      body,
      endpoint: `/user-contacts/SLACK`,
      method: 'POST',
    });
  }
}
