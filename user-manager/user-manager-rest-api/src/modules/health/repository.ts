import { MetricsProvider } from '../../common/metrics/MetricsProvider';
import { HealthMetrics } from './entity';

export class HealthRepository {
  private metricsProvider: MetricsProvider;

  constructor(metricsProvider: MetricsProvider) {
    this.metricsProvider = metricsProvider;
  }

  async getMetrics(): Promise<HealthMetrics> {
    return new Promise(resolve => {
      const freeMemory = this.metricsProvider.getFreeMemory();
      const platform = this.metricsProvider.getPlatform();
      const uptime = this.metricsProvider.getUptime();

      resolve({
        freeMemory,
        platform,
        uptime,
      });
    });
  }
}
