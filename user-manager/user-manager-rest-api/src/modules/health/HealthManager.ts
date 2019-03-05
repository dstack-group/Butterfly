import * as os from 'os';

export interface Metrics {
  uptime: number;
  platform: string;
  freeMemory: number;
}

export interface HealthMetrics {
  metrics: () => Metrics;
}

export default class HealthManager implements HealthMetrics {
  metrics(): Metrics {
    const uptime = os.uptime();
    const platform = os.platform().toString();
    const freeMemory = os.freemem();

    return {
      freeMemory,
      platform,
      uptime,
    };
  }
}
