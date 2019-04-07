import { INTERNAL_SERVER_ERROR } from 'http-status-codes';
import { Middleware } from '../router/Router';
import { Logger } from '../logger';
import { AppError } from '../errors/AppError';
import { getHTTPStatusFromErrorCode } from '../errors/errorCodeMap';

/**
 * This middleware is called is called each time an error is propagated
 * to the end of the
 * @param logger
 */
export function errorHandler(logger: Logger): Middleware {
  return async (ctx, next) => {
    try {
      /**
       * Tries to execute the logic middleware. If something goes wrong, it falls
       * back to the catch block.
       */
      await next();
    } catch (err) {
      logger.error(`Error handler triggered: ${err}`);

      if (err instanceof AppError) {
        /**
         * If this block is executed, it means that this is a controlled and foreseen error.
         */
        ctx.body = err.toJSON();
        ctx.status = getHTTPStatusFromErrorCode(err.errorKey);
      } else if (err instanceof Error) {
        /**
         * If this block is executed, it means that an unexpected error happened.
         */
        ctx.body = {
          error: true,
          message: err.message,
          request: {
            body: ctx.request.body,
            headers: ctx.request.headers,
          },
        };
        ctx.status = INTERNAL_SERVER_ERROR;
      }
    }
  };
}
