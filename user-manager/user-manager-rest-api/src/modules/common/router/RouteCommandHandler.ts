import { RouteCommand } from './RouteCommand';
import { Middleware } from '../../../utils/Router';
import { RouteContextReplier } from './RouteContextReplier';
import { RouteContextReplierFactory } from './RouteContextReplierFactory';

/**
 * RouteCommandHandler is a function that asynchrounously computes the result of a RouteCommand and passes its
 * result to an implementation of RouteContextReplier, which is responsible of responding to the HTTP request
 * with the result of said computation.
 */
export type RouteCommandHandler = <T>(command: RouteCommand<T>) => Promise<Middleware>;

/**
 * RouteCommandHandlerCreator creates a RouteCommandHandler given a RouteContextReplierFactory, which
 * is a function that, given a router context, creates an implementation of RouteContextReplier.
 */
export type RouteCommandHandlerCreator = (contextReplierFactory: RouteContextReplierFactory) => RouteCommandHandler;

export const createRouteCommandHandler: RouteCommandHandlerCreator = contextReplierFactory =>
  async <T>(command: RouteCommand<T>) =>
    async context => {
      const contextWrapper: RouteContextReplier = contextReplierFactory(context);
      const { data, status } = await command(contextWrapper);
      contextWrapper.reply(data, status);
    };
