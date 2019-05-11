import { RequestError } from './RequestError';

export class RequestException extends Error {

  constructor(error: RequestError) {
    super(`Error code: ${error.code}\n Message: ${error.message}`);
    this.name = 'RequestException';
  }
}
