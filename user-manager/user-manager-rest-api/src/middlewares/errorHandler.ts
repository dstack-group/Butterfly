import { INTERNAL_SERVER_ERROR } from 'http-status-codes';
import { Middleware } from '../router/Router';
import { Logger } from '../logger';
import { AppError, getHTTPStatusFromErrorCode } from '../errors';
import { ErrorToJSON } from '../common/errors';
import { RouteContextReplierFactory } from '@src/router/RouteContextReplierFactory';

export interface UnknownErrorToJSON extends ErrorToJSON {
  name: string;
  request?: {
    body: unknown;
    headers: unknown;
  };
  stacktrace?: string;
}

export interface ErrorHandlerParams {
  logger: Logger;
  isProduction: boolean;
  routeContextReplierFactory: RouteContextReplierFactory;
}

/**
 * This middleware is called is called each time an error is propagated
 * to the end of the middleware chain.
 * @param logger
 */
export function errorHandler(params: ErrorHandlerParams): Middleware {
  const { logger, isProduction, routeContextReplierFactory } = params;
  return async (context, next) => {
    try {
      /**
       * Tries to execute the logic middleware. If something goes wrong, it falls
       * back to the catch block.
       */
      await next();
    } catch (err) {
      logger.error(`Error handler triggered: ${err}`);

      const routeContextReplier = routeContextReplierFactory(context);

      if (err instanceof AppError) {
        /**
         * If this block is executed, it means that this is a controlled and foreseen error.
         */
        const response: ErrorToJSON = err.toJSON();
        const status = getHTTPStatusFromErrorCode(err.errorKey);

        routeContextReplier.reply(response, status);
      } else if (err instanceof Error) {
        /**
         * If this block is executed, it means that an unexpected error happened.
         */
        const response: UnknownErrorToJSON = {
          error: true,
          message: err.message,
          name: err.name,
        } as UnknownErrorToJSON;

        if (!isProduction) {
          response.request = {
            body: routeContextReplier.getRequestBody(),
            headers: routeContextReplier.getRequestHeaders(),
          };
          response.stacktrace = err.stack;
        }
        const status = INTERNAL_SERVER_ERROR;

        routeContextReplier.reply(response, status);
      }
    }
  };
}
