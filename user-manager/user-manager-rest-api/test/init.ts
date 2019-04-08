import { TestConfigManager } from './TestConfigManager';
import { TestLogger } from './TestLogger';
import { TestMetricsProvider } from './TestMetricsProvider';
import { getDatabaseConfig, DatabaseConfig, PgDatabaseConnection } from '../src/database';
import { setup } from '../src/setup';

function setupConfigManager() {
  const configManager = new TestConfigManager();
  configManager.setProperty('APP_NAME', 'user-manager-rest-api');
  configManager.setProperty('APP_HOST', 'localhost');
  configManager.setProperty('APP_PORT', '5000');
  configManager.setProperty('DATABASE_HOST', 'postgres-test');
  configManager.setProperty('DATABASE_USER', 'butterfly_user');
  configManager.setProperty('DATABASE_NAME', 'butterfly');
  configManager.setProperty('DATABASE_PASSWORD', 'butterfly_user');
  configManager.setProperty('DATABASE_PORT', '5432');

  return configManager;
}

export function setupTests() {
  const configManager = setupConfigManager();
  const logger = new TestLogger();
  const metricsProvider = new TestMetricsProvider();
  const databaseConfig: DatabaseConfig = getDatabaseConfig(configManager);
  const databaseConnection = new PgDatabaseConnection(databaseConfig);

  const { app, server } = setup({
    configManager,
    databaseConnection,
    logger,
    metricsProvider,
  });

  return { app, server, databaseConnection };
}
