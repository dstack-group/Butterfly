import { RouteContextReplier } from './RouteContextReplier';
import { Context } from '../../../utils/Router';

/**
 * A RouteContextReplierFactory must be able to create an implementation of RouteContextReplier
 * given a router context.
 */
export type RouteContextReplierFactory = (context: Context) => RouteContextReplier;
