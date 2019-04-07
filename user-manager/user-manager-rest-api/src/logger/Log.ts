import pino from 'pino';
import { Logger } from './Logger';

/**
 * Logger implementation that acts as an Adapter for the `pino` logger.
 */
export class Log implements Logger {
  private logger: pino.Logger;

  constructor() {
    this.logger = pino();
  }

  error(message: string, ...params: any[]) {
    this.logger.error(message, params);
  }

  info(message: string, ...params: any[]) {
    this.logger.info(message, params);
  }
}
