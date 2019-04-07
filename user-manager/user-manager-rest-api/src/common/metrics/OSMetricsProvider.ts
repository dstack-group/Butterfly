import * as os from 'os';
import { MetricsProvider } from './MetricsProvider';

export class OSMetricsProvider implements MetricsProvider {
  getUptime(): number {
    return os.uptime();
  }

  getPlatform(): string {
    return os.platform().toString();
  }
  getFreeMemory(): number {
    return os.freemem();
  }
}
