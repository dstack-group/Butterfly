/**
 * Contract that a class that monitors system resources must implement.
 */
export interface MetricsProvider {
  /**
   * Returns the aliveness time of the application in milliseconds.
   */
  getUptime(): number;

  /**
   * Returns the system platform where the application runs.
   */
  getPlatform(): string;

  /**
   * Returns the amount of free memory available to the application.
   */
  getFreeMemory(): number;
}
