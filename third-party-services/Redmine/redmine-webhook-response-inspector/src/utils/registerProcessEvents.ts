import { Logger } from '../config/logger';
import { Server } from '../server';

export function registerProcessEvents(
  logger: Logger,
  app: Server,
) {
  process.on('uncaughtException', (error: Error) => {
    logger.error('UncaughtException', error);
  });

  process.on('unhandledRejection', (reason: any, promise: any) => {
    logger.info(reason, promise);
  });

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
