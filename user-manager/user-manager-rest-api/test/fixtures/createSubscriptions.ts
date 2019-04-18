import { PgDatabaseConnection, GetQueries } from '../../src/database';
import { CreateSubscription, Subscription } from '../../src/modules/subscriptions/entity';
import { ServiceEventType } from '../../src/common/Event';
import { UserPriority } from '../../src/common/UserPriority';
import { ThirdPartyContactService } from '../../src/common/ThirdPartyContactService';

const query = `SELECT *
               FROM public.create_subscription(
                 $[userEmail],
                 $[projectName],
                 $[eventType],
                 $[userPriority],
                 $[contactServices]::public.consumer_service[],
                 $[keywords]::text[]
               );`;

export const createSubscriptionQuery = query;

export interface CreateSubscriptionResult {
  result: Subscription;
  transaction: Promise<void>;
}

export function createSubscription(database: PgDatabaseConnection): CreateSubscriptionResult {
  const subscriptionParams: CreateSubscription = {
    userEmail: 'federico.rispo@gmail.com',
    projectName: 'Amazon',
    eventType: ServiceEventType.GITLAB_ISSUE_CREATED,
    userPriority: UserPriority.LOW,
    contactServices: [
      ThirdPartyContactService.TELEGRAM,
      ThirdPartyContactService.EMAIL,
    ],
    keywords: ['FIX', 'BUG', 'RESOLVE'],
  };

  const { contactServices, keywords, ...other } = subscriptionParams;

  const subscriptionResult: Subscription = {
    ...other,
    keywordList: keywords,
    subscriptionId: '1',
    userContactMap: {
      [ThirdPartyContactService.TELEGRAM]: 'frispo',
      [ThirdPartyContactService.EMAIL]: 'dstackgroup@gmail.com',
    },
  };

  const getSubscriptionQuery: GetQueries<Subscription> = t => {
    const subscriptionQuery = t.any(query, subscriptionParams);
    return [subscriptionQuery];
  };

  return {
    result: subscriptionResult,
    transaction: database.transaction(getSubscriptionQuery),
  };
}
