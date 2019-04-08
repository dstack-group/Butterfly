import { ErrorParams } from './ErrorParams';

export interface ErrorToJSON {
  code: ErrorParams['code'];
  error: true;
  message: ErrorParams['message'];
}
