/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    user-manager-rest-api
 * @fileName:  createSearchReceivers.ts
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

import { Event, ServiceEventType } from '../../src/common/Event';
import { UserPriority } from '../../src/common/UserPriority';
import { ThirdPartyProducerService } from '../../src/common/ThirdPartyProducerService';
import { PgDatabaseConnection, GetQueries } from '../../src/database';
import { EventReceiversResult } from '../../src/modules/search/entity';
import { Project } from '../../src/modules/projects/entity';
import { User } from '../../src/modules/users/entity';
import { ThirdPartyContactService } from '../../src/common/ThirdPartyContactService';
import { createProjectQuery } from './createProjects';
import { createUserQuery } from './createUsers';
import { createUserContactsQuery } from './createUserContacts';
import { CreateSubscription } from '../../src/modules/subscriptions/entity';
import { createSubscriptionQuery } from './createSubscriptions';

export function createEvent(partialEvent: Partial<Event> = {}): Event {
  const event: Event = {
    // tslint:disable-next-line: max-line-length
    description: 'Random and pretty long description that discusses about the importance of writing clean and performance-wise code. Something must be fixed.',
    eventId: '1',
    eventType: ServiceEventType.GITLAB_ISSUE_CREATED,
    projectName: 'Amazon',
    projectURL: 'gitlab.amazon.com/amazon/amazon.git',
    service: ThirdPartyProducerService.GITLAB,
    tags: ['bug', 'revert'],
    title: 'New performance bug for you',
    userEmail: 'federico.rispo@gmail.com',
    timestamp: new Date(),
    ...partialEvent,
  };

  return event;
}

export interface InitializeSearchReceiversDataResult {
  event: Event;
  result: EventReceiversResult;
  transaction: Promise<void>;
}

export function initializeSearchReceiversData(database: PgDatabaseConnection): InitializeSearchReceiversDataResult {
  const projects: Project[] = [
    {
      projectId: '1',
      projectName: 'Amazon',
      projectURL: 'gitlab.amazon.com/amazon/amazon.git',
    },
  ];

  const users: User[] = [
    {
      email: 'federico.rispo@gmail.com',
      firstname: 'Federico',
      lastname: 'Rispo',
      userId: '2',
    },
    {
      email: 'enrico.trinco@gmail.com',
      firstname: 'Enrico',
      lastname: 'Trinco',
      userId: '3',
    },
    {
      email: 'eleonorasignor@gmail.com',
      firstname: 'Eleonora',
      lastname: 'Signor',
      userId: '4',
    },
  ];

  const userContacts = [
    {
      contactRef: 'frispo',
      contactType: ThirdPartyContactService.TELEGRAM,
      userEmail: 'federico.rispo@gmail.com',
    },
    {
      contactRef: 'dstackgroup@gmail.com',
      contactType: ThirdPartyContactService.EMAIL,
      userEmail: 'federico.rispo@gmail.com',
    },
    {
      contactRef: 'enrico_dogen',
      contactType: ThirdPartyContactService.TELEGRAM,
      userEmail: 'enrico.trinco@gmail.com',
    },
    {
      contactRef: 'esignor',
      contactType: ThirdPartyContactService.TELEGRAM,
      userEmail: 'eleonorasignor@gmail.com',
    },
    {
      contactRef: 'dstackgroup@gmail.com',
      contactType: ThirdPartyContactService.EMAIL,
      userEmail: 'eleonorasignor@gmail.com',
    },
  ];

  const subscriptions: CreateSubscription[] = [
    {
      userEmail: 'federico.rispo@gmail.com',
      projectName: 'Amazon',
      eventType: ServiceEventType.GITLAB_ISSUE_CREATED,
      userPriority: UserPriority.LOW,
      contactServices: [
        ThirdPartyContactService.TELEGRAM,
        ThirdPartyContactService.EMAIL,
      ],
      keywords: ['FIX', 'BUG', 'RESOLVE'],
    },
  ];

  const searchReceiversResult: EventReceiversResult = {
    userContactList: [
      {
        firstname: 'Federico',
        lastname: 'Rispo',
        contactInfo: {
          [ThirdPartyContactService.TELEGRAM]: 'frispo',
          [ThirdPartyContactService.EMAIL]: 'dstackgroup@gmail.com',
        },
      },
    ],
  };

  const getInitializeSearchReceiversQueries: GetQueries<unknown> = t => {
    const projectResults =
      projects.map(project => t.any(createProjectQuery, project));
    const userResults =
      users.map(user => t.any(createUserQuery, user));
    const userContactResults =
      userContacts.map(userContact => t.any(createUserContactsQuery, userContact));
    const subscriptionResults =
      subscriptions.map(subscription => t.any(createSubscriptionQuery, subscription));

    return [
      ...projectResults,
      ...userResults,
      ...userContactResults,
      ...subscriptionResults,
    ];
  };

  const event = createEvent();

  return {
    event,
    result: searchReceiversResult,
    transaction: database.transaction(getInitializeSearchReceiversQueries),
  };
}
