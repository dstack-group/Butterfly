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
   * Emitted when an error isn't explicitly caught
   */
  process.on('uncaughtException', (error: Error) => {
    logger.error('UncaughtException ' + error);
  });

  /**
   * Emitted when a Promise terminates unexpectly and no `catch` clause
   * has been applied
   */
  process.on('unhandledRejection', <T>(reason: unknown, promise: Promise<T>) => {
    logger.error('unhandledRejection ' + reason);
  });

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
