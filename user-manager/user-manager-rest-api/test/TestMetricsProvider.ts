import { MetricsProvider } from '../src/common/metrics/MetricsProvider';

export class TestMetricsProvider implements MetricsProvider {
  getUptime() {
    return 1000;
  }

  getPlatform() {
    return 'TEST_PLATFORM';
  }

  getFreeMemory() {
    return 2000;
  }
}
