/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    slack-account-configurator
 * @fileName:  index.ts
 * @created:   2019-05-07
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
import { EnvironmentConfigManager } from './config';
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
// @ts-ignore
// tslint:disable-next-line: no-string-literal
  logger.error('unhandledRejection ' + reason + ' ' + reason['stack']);
});

(async () => {
  const { app, server } = await setup({
    configManager,
    logger,
  });

  registerProcessEvents(logger, app);

  server.on('close', () => {
    logger.info('Server closed');
  });

  server.on('error', error => {
    logger.error('Server error', error);
  });
})();
