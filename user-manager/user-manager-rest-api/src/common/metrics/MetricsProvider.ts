export interface MetricsProvider {
  getUptime(): number;
  getPlatform(): string;
  getFreeMemory(): number;
}
