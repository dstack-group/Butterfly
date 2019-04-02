import pino from 'pino';

/**
 * General logger contact
 */
export interface Logger {
  error: (message: string, ...params: any[]) => void;
  info: (message: string, ...params: any[]) => void;
}

/**
 * Logger implementation that acts as an Adapter for the `pino` logger.
 */
export class Log implements Logger {
  private logger: pino.Logger;
  private appName: string;

  constructor(appName: string) {
    this.appName = appName;
    this.logger = pino();
  }

  error(message: string, ...params: any[]) {
    this.logger.error(this.appName, message, params);
  }

  info(message: string, ...params: any[]) {
    this.logger.info(this.appName, message, params);
  }
}
