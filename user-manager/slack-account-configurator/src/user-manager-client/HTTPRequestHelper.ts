/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    slack-account-configurator
 * @fileName:  HTTPRequestHelper.ts
 * @created:   2019-05-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

import fetch, { FetchError } from 'node-fetch';
import { RequestParams } from './RequestParams';
import { ConflictError } from './errors/ConflictError';
import { TimeoutError } from './errors/TimeoutError';

/**
 * HTTPRequestHelper
 */
export class HTTPRequestHelper {
  private baseURL: string;
  private headers: { [header: string]: string };
  private timeout: number;

  constructor(baseURL: string, timeout: number) {
    this.baseURL = baseURL;
    this.headers = {
      'Content-Type': 'application/json',
    };
    this.timeout = timeout;
  }

  submitRequest<T>(params: RequestParams) {
    const url = `${this.baseURL}${params.endpoint}`;
    // tslint:disable-next-line: no-console
    console.log('URL', url);
    return new Promise<T>(async (resolve, reject) => {
      // tslint:disable-next-line: no-console
      console.log('SENDING BODY:', params.body);
      try {
        const response = await fetch(url, {
          body: params.body ?
            JSON.stringify(params.body) :
            undefined,
          headers: this.headers,
          method: params.method,
          timeout: this.timeout,
        });

        const json = await response.json();

        if (json.error) {
          if (response.status === 409) {
            reject(new ConflictError());
          } else {
            reject(json.error);
          }
        } else {
          resolve(json.data as T);
        }

      } catch (error) {
        if (error instanceof FetchError) {
          if (error.type === 'request-timeout') {
            reject(new TimeoutError(this.timeout));
            return;
          }
        }

        reject(error);
      }
    });
  }
}
