/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    user-manager-rest-api
 * @fileName:  index.ts
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

import { Log } from './logger';
import { registerProcessEvents } from './utils/registerProcessEvents';
import { getDatabaseConfig, DatabaseConfig, PgDatabaseConnection } from './database';
import { EnvironmentConfigManager } from './config';
import { OSMetricsProvider } from './common/metrics/OSMetricsProvider';
import { setup } from './setup';

const configManager = new EnvironmentConfigManager();
const logger = new Log();

/**
 * Emitted when an error isn't explicitly caught. This can happen only during the initialization process,
 * because the APIs logic errors are already handled by the errorHandler middleware.
 */
process.on('uncaughtException', (error: Error) => {
  logger.error('UncaughtException ' + error);
  process.exit(1);
});

/**
 * Emitted when a Promise terminates unexpectly and no `catch` clause
 * has been applied
 */
process.on('unhandledRejection', <T>(reason: unknown, promise: Promise<T>) => {
  logger.error('unhandledRejection ' + reason);
});

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
  .then(async connected => {
    if (connected) {
      logger.info('Connected to database');
    } else {
      logger.error('Cannot contact database');
      await app.closeServer();
      process.exit(1);
    }
  })
  .catch(error => {
    throw error;
  });
