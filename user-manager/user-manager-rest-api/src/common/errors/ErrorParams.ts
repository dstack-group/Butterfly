import { ErrorType } from './ErrorType';

export interface ErrorParams {
  code: ErrorType;
  errorKey: keyof typeof ErrorType;
  message: string;
  error?: Error;
}
