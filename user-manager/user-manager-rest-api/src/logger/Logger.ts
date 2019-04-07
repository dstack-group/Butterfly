/**
 * General logger contact
 */
export interface Logger {
  error: (message: string, ...params: any[]) => void;
  info: (message: string, ...params: any[]) => void;
}
