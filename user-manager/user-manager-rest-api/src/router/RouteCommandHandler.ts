import { RouteCommand } from './RouteCommand';
import { Middleware } from './Router';
import { RouteContextReplier } from './RouteContextReplier';
import { RouteContextReplierFactory } from './RouteContextReplierFactory';

/**
 * RouteCommandHandler is a function that computes the result of the given RouteCommand and passes its
 * result to an implementation of RouteContextReplier, which is responsible of responding to the HTTP request
 * with the result of said computation.
 */
export type RouteCommandHandler = <T>(routeCommandCreator: RouteCommand<T>) => Middleware;

/**
 * RouteCommandHandlerCreator creates a RouteCommandHandler given a RouteContextReplierFactory, which
 * is a function that, given a router context, creates an implementation of RouteContextReplier.
 */
export type RouteCommandHandlerCreator = (contextReplierFactory: RouteContextReplierFactory) => RouteCommandHandler;

export const createRouteCommandHandler: RouteCommandHandlerCreator = contextReplierFactory =>
  routeCommandCreator =>
    async context => {
      const contextWrapper: RouteContextReplier = contextReplierFactory(context);
      const { data, status } = await routeCommandCreator(contextWrapper);
      contextWrapper.reply(data, status);
    };
