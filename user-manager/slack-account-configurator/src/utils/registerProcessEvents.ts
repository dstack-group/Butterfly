/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    slack-account-configurator
 * @fileName:  registerProcessEvents.ts
 * @created:   2019-05-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

import { Logger } from '../logger';
import { Server } from '../server/Server';

/**
 * Utility that handles what should happen when the following events are emitted
 * by `process`.
 * @param logger
 * @param app
 */
export function registerProcessEvents(
  logger: Logger,
  app: Server,
) {
  /**
   * Emitted when the process in which the application is running gets unexpectedly and forcefully closed,
   * for instance after a CTRL+C event.
   */
  process.on('SIGTERM', async () => {
    logger.info('Starting graceful shutdown');

    let exitCode = 0;
    const shutdownHooks = [app.closeServer()];

    for (const s of shutdownHooks) {
      try {
        await s;
      } catch (e) {
        logger.error('Error in graceful shutdown ', e);
        exitCode = 1;
      }
    }

    process.exit(exitCode);
  });
}
