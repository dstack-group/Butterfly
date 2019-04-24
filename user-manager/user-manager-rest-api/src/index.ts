import { Log } from './logger';
import { registerProcessEvents } from './utils/registerProcessEvents';
import { getDatabaseConfig, DatabaseConfig, PgDatabaseConnection } from './database';
import { EnvironmentConfigManager } from './config';
import { OSMetricsProvider } from './common/metrics/OSMetricsProvider';
import { setup } from './setup';

const configManager = new EnvironmentConfigManager();
const logger = new Log();
const metricsProvider = new OSMetricsProvider();
const databaseConfig: DatabaseConfig = getDatabaseConfig(configManager);
const databaseConnection = new PgDatabaseConnection(databaseConfig);

const { app, server } = setup({
  configManager,
  databaseConnection,
  logger,
  metricsProvider,
});

registerProcessEvents(logger, app);

server.on('close', () => {
  logger.info('Server closed');
});

server.on('error', error => {
  logger.error('Server error', error);
});

app.isConnectedToDatabase()
  .then(connected => {
    if (connected) {
      logger.info('Connected to database');
    } else {
      logger.error('Cannot contact database');
    }
  })
  .catch(error => {
    throw error;
  });
