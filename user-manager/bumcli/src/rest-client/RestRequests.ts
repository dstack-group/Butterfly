import { ServerConfig } from './ServerConfig';
import { RequestException} from './exception';

import fetch from 'node-fetch';

export abstract class RestRequests {

  private server: ServerConfig;
  private headers;

  constructor() {

    // TODO: Fetch this variables from config file
    this.server = {
      hostname: "http://localhost",
      port: 5000,
      timeout: 1000
    }

    this.headers = {'Content-Type': 'application/json'};
  }

  private getURL(): string {
    return this.server.hostname + ":" + this.server.port;
  }


  submitRequest<T>(endpoint: string, _method: string, _body?: object): Promise<T> {

    // Create options parameters necessary for the request
    const options = {
      method: _method,
      body: _body ? JSON.stringify(_body) : undefined,
      headers:this.headers,
      timeout: this.server.timeout
    };

    return new Promise(async (resolve, reject) => {
      try {
        const response = await fetch(this.getURL() + "/" + endpoint, options);
        const body = await response.json();

        /*
         * The <code>ok</code> method checks if the code of the
         * request response  is >= 200 and <= 300
         */

        if(response.ok)
          resolve(body['data'] as T);
        else
          reject(new RequestException({code: body.code, message: body.message}));
      }
      catch(err) {
        // Necessary to catch all the Network errors
        reject(err);
      }
    });
  }
}
