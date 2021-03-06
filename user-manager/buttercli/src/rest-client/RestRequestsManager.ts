import { ServerConfig } from '../database/ServerConfig';
import { RequestException} from './exception';

import fetch from 'node-fetch';

/*
 * This enumerator represents every http method that can be
 * used to make http request in the submitRequest()
 */
export enum HttpMethod {
  GET = 'GET',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
  POST = 'POST',
  PUT = 'PUT',
}

export class RestRequestsManager {

  private server: ServerConfig;
  private headers: {[key: string]: string};

  constructor(serverConfig: ServerConfig) {

    if (!serverConfig.hostname || !serverConfig.port) {
      throw new Error('Invalid server configuration settings');
    }

    this.server = serverConfig;
    this.headers = {'Content-Type': 'application/json'};
  }

  private getURL(): string {
    return `${this.server.hostname}:${this.server.port}`;
  }

  submitRequest<T>(path: string, method: HttpMethod, body?: {}): Promise<T> {

    // Create options parameters necessary for the request
    const options = {
      body: body ? JSON.stringify(body) : undefined,
      headers: this.headers,
      method: HttpMethod[method],
      timeout: this.server.timeout,
    };

    return new Promise(async (resolve, reject) => {
      try {
        const response = await fetch(`${this.getURL()}/${path}`, options);
        const content = await response.json();

        /*
         * The <code>ok</code> method checks if the code of the
         * request response  is >= 200 and <= 300
         */
        if (response.ok) {
          resolve(content.data as T);
        } else {
          reject(new RequestException({code: content.code, message: content.message}));
        }
      } catch (error) {
        // Necessary to catch all the Network errors
        reject(error);
      }
    });
  }
}
