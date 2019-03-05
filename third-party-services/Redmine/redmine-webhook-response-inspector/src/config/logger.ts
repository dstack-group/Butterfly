import pino from 'pino';
import { config } from './index';

export interface Logger {
  error: (message: string, ...params: any[]) => void;
  info: (message: string, ...params: any[]) => void;
}

export class Log implements Logger {
  private logger: pino.Logger;

  constructor() {
    this.logger = pino();
  }

  error(message: string, ...params: any[]) {
    this.logger.error(config.name, message, params);
  }

  info(message: string, ...params: any[]) {
    this.logger.info(config.name, message, params);
  }
}
