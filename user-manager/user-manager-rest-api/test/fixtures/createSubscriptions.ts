/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    user-manager-rest-api
 * @fileName:  createSubscriptions.ts
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

import { PgDatabaseConnection, GetQueries } from '../../src/database';
import { CreateSubscriptionBody, Subscription } from '../../src/modules/subscriptions/entity';
import { User } from '../../src/modules/users/entity';
import { Project } from '../../src/modules/projects/entity';
import { createUsers } from './createUsers';
import { createProjects } from './createProjects';
import { createUserContacts } from './createUserContacts';
import { UserContact } from '../../src/modules/userContacts/entity';

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

export interface CreateSubscriptionParams {
  createSubscriptionBodies: CreateSubscriptionBody[];
  expectedSubscriptionResults?: Subscription[];
  projects: Project[];
  userContacts: UserContact[];
  users: User[];
}

export interface CreateSubscriptionsResult {
  results?: Subscription[];
  transaction: () => Promise<void>;
}

export async function createSubscriptionsWithInitialization(
  database: PgDatabaseConnection,
  params: CreateSubscriptionParams,
): Promise<CreateSubscriptionsResult> {
  const {
    projects,
    users,
    userContacts,
    createSubscriptionBodies,
    expectedSubscriptionResults,
  } = params;

  const { transaction: createUserTransaction } = createUsers(database, users);
  const { transaction: createProjectTransaction } = createProjects(database, projects);
  const { transaction: createUserContactsTransaction } = createUserContacts(database, userContacts);

  await createUserTransaction;
  await createProjectTransaction;
  await createUserContactsTransaction();

  const getSubscriptionQueries: GetQueries<Subscription> = t => {
    return createSubscriptionBodies.map(createSubscription => t.any(query, createSubscription));
  };

  return {
    results: expectedSubscriptionResults,
    transaction: () => database.transaction(getSubscriptionQueries),
  };
}
