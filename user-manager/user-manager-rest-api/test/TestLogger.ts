import { Logger } from '../src/logger';

export class TestLogger implements Logger {
  error(message: string, ...params: any[]) {
    // empty
  }

  info(message: string, ...params: any[]) {
    // empty
  }
}
