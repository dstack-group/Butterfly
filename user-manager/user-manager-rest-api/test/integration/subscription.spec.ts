/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    user-manager-rest-api
 * @fileName:  subscription.spec.ts
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

import 'jest';
import { setupTests } from '../init';
import supertest from 'supertest';
import { Server as AppServer } from '../../src/server';
import { Server } from 'http';
import { PgDatabaseConnection, truncData } from '../../src/database';
import { createSubscriptionsWithInitialization } from '../fixtures/createSubscriptions';
import { Subscription, CreateSubscriptionBody, UpdateSubscriptionBody } from '../../src/modules/subscriptions/entity';
import { ParseSyntaxError } from '../../src/errors';
import { UserPriority } from '../../src/common/UserPriority';
import { ThirdPartyContactService } from '../../src/common/ThirdPartyContactService';
import { User } from '../../src/modules/users/entity';
import { Project } from '../../src/modules/projects/entity';
import { ServiceEventType } from '../../src/common/Event';
import { UserContact } from '../../src/modules/userContacts/entity';
import { runInContext } from 'vm';

let app: AppServer;
let server: Server;
let databaseConnection: PgDatabaseConnection;

/**
 * Spins up a new HTTP server and a new database connection before each test executes.
 * It also removes the database rows every time, ensuring that the only things left definted
 * in the database are tables, functions, procedures and views.
 */
beforeEach(async done => {
  const setup = setupTests();
  app = setup.app;
  server = setup.server;
  databaseConnection = setup.databaseConnection;
  truncData(databaseConnection).then(done);
});

afterEach(done => {
  app.closeServer().then(done);
});

describe(`GET /subscripions/users/:userEmail`, () => {
  it(`Should return every subscription related to the user identified by the given email`, async done => {
    const users: User[] = [
      {
        email: 'alberto.schiabel@gmail.com',
        enabled: true,
        firstname: 'Alberto',
        lastname: 'Schiabel',
        userId: '1',
      },
      {
        email: 'other.user@email.com',
        enabled: true,
        firstname: 'Other',
        lastname: 'Other',
        userId: '2',
      },
    ];

    const projects: Project[] = [
      {
        projectId: '1',
        projectName: 'Butterfly',
        projectURL: {
          GITLAB: 'https://localhost:10443/dstack/butterfly',
        },
      },
      {
        projectId: '2',
        projectName: 'Amazon',
        projectURL: {
          SONARQUBE: 'https://sonarqube.amazon.com',
        },
      },
    ];

    const userContacts: UserContact[] = [
      {
        contactRef: 'USER_0_TELEGRAM_REF',
        contactService: ThirdPartyContactService.TELEGRAM,
        userEmail: users[0].email,
      },
      {
        contactRef: 'USER_0_EMAIL_REF',
        contactService: ThirdPartyContactService.EMAIL,
        userEmail: users[0].email,
      },
      {
        contactRef: 'USER_1_TELEGRAM_REF',
        contactService: ThirdPartyContactService.TELEGRAM,
        userEmail: users[1].email,
      },
      {
        contactRef: 'USER_1_SLACK_REF',
        contactService: ThirdPartyContactService.SLACK,
        userEmail: users[1].email,
      },
    ];

    const createSubscriptionBodies: CreateSubscriptionBody[] = [
      {
        contactServices: [userContacts[0].contactService, userContacts[1].contactService],
        eventType: ServiceEventType.GITLAB_ISSUE_CREATED,
        keywords: ['BUG', 'FIX', 'CLOSE'],
        projectName: projects[0].projectName,
        userEmail: users[0].email,
        userPriority: UserPriority.LOW,
      },
      {
        contactServices: [userContacts[0].contactService],
        eventType: ServiceEventType.SONARQUBE_PROJECT_ANALYSIS_COMPLETED,
        keywords: ['SORTED', 'KEYWORDS'],
        projectName: projects[1].projectName,
        userEmail: users[0].email,
        userPriority: UserPriority.MEDIUM,
      },
      {
        contactServices: [userContacts[2].contactService, userContacts[3].contactService],
        eventType: ServiceEventType.GITLAB_ISSUE_CREATED,
        keywords: ['OTHER', 'FIX'],
        projectName: projects[0].projectName,
        userEmail: users[1].email,
        userPriority: UserPriority.HIGH,
      },
    ];

    const expectedSubscriptionsForCurrentUser: Subscription[] = [
      {
        contacts: {
          EMAIL: 'USER_0_EMAIL_REF',
          TELEGRAM: 'USER_0_TELEGRAM_REF',
        },
        eventType: createSubscriptionBodies[0].eventType,
        keywords: ['BUG', 'CLOSE', 'FIX'],
        projectName: createSubscriptionBodies[0].projectName,
        userEmail: users[0].email,
        userPriority: createSubscriptionBodies[0].userPriority,
      },
      {
        contacts: {
          TELEGRAM: 'USER_0_TELEGRAM_REF',
        },
        eventType: createSubscriptionBodies[1].eventType,
        keywords: ['KEYWORDS', 'SORTED'],
        projectName: createSubscriptionBodies[1].projectName,
        userEmail: users[0].email,
        userPriority: createSubscriptionBodies[1].userPriority,
      },
    ];

    const expectedSubscriptionResults: Subscription[] = [
      ...expectedSubscriptionsForCurrentUser,
      {
        contacts: {
          SLACK: 'USER_1_SLACK_REF',
          TELEGRAM: 'USER_1_TELEGRAM_REF',
        },
        eventType: createSubscriptionBodies[2].eventType,
        keywords: ['FIX', 'OTHER'],
        projectName: createSubscriptionBodies[2].projectName,
        userEmail: users[1].email,
        userPriority: createSubscriptionBodies[2].userPriority,
      },
    ];

    const { transaction } = await createSubscriptionsWithInitialization(
      databaseConnection,
      {
        createSubscriptionBodies,
        expectedSubscriptionResults,
        projects,
        userContacts,
        users,
      },
    );

    const endpoint = `/subscriptions/users/${users[0].email}`;

    transaction()
      .then(() => {
        supertest(server)
          .get(endpoint)
          .expect('Content-Type', /application\/json/)
          .expect(response => {
            expect(response.body).toHaveProperty('data');
            expect(response.body.data.length).toBe(expectedSubscriptionsForCurrentUser.length);
            (response.body.data as Subscription[]).forEach((obj, i) => {
              expect(obj).toMatchObject(expectedSubscriptionsForCurrentUser[i]);
            });
          })
          .expect(200, done);
      })
      .catch(e => {
        expect(e).toBe(undefined);
      });
  });

  /*
  it(`The response data should be an empty array if no user is saved`, done => {
    supertest(server)
      .get('/users')
      .expect('Content-Type', /application\/json/)
      .expect(response => {
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toEqual([]);
      })
      .expect(200, done);
  });
  */
});

describe(`POST /subscriptions`, () => {
  it(`Should return ParseSyntaxError if the body request isn't a valid JSON`, done => {
    const payload = '{"userEmail":"email@emai.com","projectName"}';
    supertest(server)
      .post('/subscriptions')
      .set('Content-Type', 'application/json')
      .send(payload)
      .expect('Content-Type', /application\/json/)
      .expect(response => {
        expect(response.body).not.toHaveProperty('data');
        expect(response.body).toHaveProperty('error');
        expect(response.body).toMatchObject(new ParseSyntaxError('body').toJSON());
      })
      .expect(400, done);
  });

  it(`Should fail if another subscription associated with the same user, project and
      event type already exists`, async done => {
    const users: User[] = [
      {
        email: 'alberto.schiabel@gmail.com',
        enabled: true,
        firstname: 'Alberto',
        lastname: 'Schiabel',
        userId: '1',
      },
    ];

    const projects: Project[] = [
      {
        projectId: '1',
        projectName: 'Butterfly',
        projectURL: {
          GITLAB: 'https://localhost:10443/dstack/butterfly',
        },
      },
    ];

    const user = users[0];
    const project = projects[0];

    const userContacts: UserContact[] = [
      {
        contactRef: 'TELEGRAM_REF',
        contactService: ThirdPartyContactService.TELEGRAM,
        userEmail: user.email,
      },
      {
        contactRef: 'EMAIL_REF',
        contactService: ThirdPartyContactService.EMAIL,
        userEmail: user.email,
      },
    ];

    const createSubscriptionBodies: CreateSubscriptionBody[] = [
      {
        contactServices: [userContacts[0].contactService, userContacts[1].contactService],
        eventType: ServiceEventType.GITLAB_ISSUE_CREATED,
        keywords: ['BUG', 'FIX', 'CLOSE'],
        projectName: project.projectName,
        userEmail: user.email,
        userPriority: UserPriority.LOW,
      },
    ];

    const { transaction } = await createSubscriptionsWithInitialization(
      databaseConnection,
      {
        createSubscriptionBodies,
        projects,
        userContacts,
        users,
      },
    );

    transaction()
      .then(() => {
        supertest(server)
          .post('/subscriptions')
          .send(createSubscriptionBodies[0])
          .expect('Content-Type', /application\/json/)
          .expect(response => {
            expect(response.body).not.toHaveProperty('data');
            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toBe(true);
          })
          .expect(409, done);
      })
      .catch(e => {
        expect(e).toBe(undefined);
      });
  });

  it(`Should return the newly inserted subscription if the INSERT operation is successful`, async done => {
    const users: User[] = [
      {
        email: 'alberto.schiabel@gmail.com',
        enabled: true,
        firstname: 'Alberto',
        lastname: 'Schiabel',
        userId: '1',
      },
    ];

    const projects: Project[] = [
      {
        projectId: '1',
        projectName: 'Butterfly',
        projectURL: {
          GITLAB: 'https://localhost:10443/dstack/butterfly',
        },
      },
    ];

    const user = users[0];
    const project = projects[0];

    const userContacts: UserContact[] = [
      {
        contactRef: 'TELEGRAM_REF',
        contactService: ThirdPartyContactService.TELEGRAM,
        userEmail: user.email,
      },
      {
        contactRef: 'EMAIL_REF',
        contactService: ThirdPartyContactService.EMAIL,
        userEmail: user.email,
      },
    ];

    const createSubscriptionBodies: CreateSubscriptionBody[] = [
      {
        contactServices: [userContacts[0].contactService, userContacts[1].contactService],
        eventType: ServiceEventType.GITLAB_ISSUE_CREATED,
        keywords: ['BUG', 'FIX', 'CLOSE'],
        projectName: project.projectName,
        userEmail: user.email,
        userPriority: UserPriority.LOW,
      },
    ];

    const createSubscriptionBody = createSubscriptionBodies[0];

    const expectedSubscriptionResults: Subscription[] = [
      {
        contacts: {
          EMAIL: 'EMAIL_REF',
          TELEGRAM: 'TELEGRAM_REF',
        },
        eventType: createSubscriptionBody.eventType,
        // the returned keyword list should be sorted
        keywords: [
          'BUG',
          'CLOSE',
          'FIX',
        ],
        projectName: createSubscriptionBody.projectName,
        userEmail: createSubscriptionBody.userEmail,
        userPriority: createSubscriptionBody.userPriority,
      },
    ];

    await createSubscriptionsWithInitialization(
      databaseConnection,
      {
        createSubscriptionBodies,
        expectedSubscriptionResults,
        projects,
        userContacts,
        users,
      },
    );

    supertest(server)
      .post('/subscriptions')
      .send(createSubscriptionBody)
      .expect('Content-Type', /application\/json/)
      .expect(response => {
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toMatchObject(expectedSubscriptionResults[0]);

        /**
         * data.subscriptionId should be of type string.
         */
        expect(response.body.data).toHaveProperty('subscriptionId');
        expect(typeof response.body.data.subscriptionId).toBe('string');
      })
    .expect(201, done);
  });
});

describe(`GET /subscriptions/users/:userEmail/projects/:projectName/event-types/:eventType`, () => {
  it(`Should return the subscription record if the provided user email, project name,
      event type are associated with, respectively, a user, a project and a supported service event`, async done => {
    const users: User[] = [
      {
        email: 'alberto.schiabel@gmail.com',
        enabled: true,
        firstname: 'Alberto',
        lastname: 'Schiabel',
        userId: '1',
      },
      {
        email: 'other.user@email.com',
        enabled: true,
        firstname: 'Other',
        lastname: 'Other',
        userId: '2',
      },
    ];

    const projects: Project[] = [
      {
        projectId: '1',
        projectName: 'Butterfly',
        projectURL: {
          GITLAB: 'https://localhost:10443/dstack/butterfly',
        },
      },
      {
        projectId: '2',
        projectName: 'Amazon',
        projectURL: {
          SONARQUBE: 'https://sonarqube.amazon.com',
        },
      },
    ];

    const userContacts: UserContact[] = [
      {
        contactRef: 'USER_0_TELEGRAM_REF',
        contactService: ThirdPartyContactService.TELEGRAM,
        userEmail: users[0].email,
      },
      {
        contactRef: 'USER_0_EMAIL_REF',
        contactService: ThirdPartyContactService.EMAIL,
        userEmail: users[0].email,
      },
      {
        contactRef: 'USER_1_TELEGRAM_REF',
        contactService: ThirdPartyContactService.TELEGRAM,
        userEmail: users[1].email,
      },
      {
        contactRef: 'USER_1_SLACK_REF',
        contactService: ThirdPartyContactService.SLACK,
        userEmail: users[1].email,
      },
    ];

    const createSubscriptionBodies: CreateSubscriptionBody[] = [
      {
        contactServices: [userContacts[0].contactService, userContacts[1].contactService],
        eventType: ServiceEventType.GITLAB_ISSUE_CREATED,
        keywords: ['BUG', 'FIX', 'CLOSE'],
        projectName: projects[0].projectName,
        userEmail: users[0].email,
        userPriority: UserPriority.LOW,
      },
      {
        contactServices: [userContacts[0].contactService],
        eventType: ServiceEventType.SONARQUBE_PROJECT_ANALYSIS_COMPLETED,
        keywords: ['SORTED', 'KEYWORDS'],
        projectName: projects[1].projectName,
        userEmail: users[0].email,
        userPriority: UserPriority.MEDIUM,
      },
      {
        contactServices: [userContacts[2].contactService, userContacts[3].contactService],
        eventType: ServiceEventType.GITLAB_ISSUE_CREATED,
        keywords: ['OTHER', 'FIX'],
        projectName: projects[0].projectName,
        userEmail: users[1].email,
        userPriority: UserPriority.HIGH,
      },
    ];

    const expectedSubscriptionForCurrentUser: Subscription = {
      contacts: {
        TELEGRAM: 'USER_0_TELEGRAM_REF',
      },
      eventType: createSubscriptionBodies[1].eventType,
      keywords: ['KEYWORDS', 'SORTED'],
      projectName: createSubscriptionBodies[1].projectName,
      userEmail: users[0].email,
      userPriority: createSubscriptionBodies[1].userPriority,
    };

    // tslint:disable-next-line: max-line-length
    const endpoint = `/subscriptions/users/${users[0].email}/projects/${createSubscriptionBodies[1].projectName}/event-types/${createSubscriptionBodies[1].eventType}`;

    const { transaction } = await createSubscriptionsWithInitialization(
      databaseConnection,
      {
        createSubscriptionBodies,
        projects,
        userContacts,
        users,
      },
    );

    transaction()
      .then(() => {
        supertest(server)
          .get(endpoint)
          .expect('Content-Type', /application\/json/)
          .expect(response => {
            expect(response.body).toHaveProperty('data');
            expect(response.body.data).toMatchObject(expectedSubscriptionForCurrentUser);
          })
          .expect(200, done);
      })
      .catch(e => {
        expect(e).toBe(undefined);
      });
  });

  it(`Should return a NotFound error if no subscription exists with the given user email,
      project name and event type`, async done => {
    const users: User[] = [
      {
        email: 'alberto.schiabel@gmail.com',
        enabled: true,
        firstname: 'Alberto',
        lastname: 'Schiabel',
        userId: '1',
      },
    ];

    const projects: Project[] = [
      {
        projectId: '1',
        projectName: 'Butterfly',
        projectURL: {
          GITLAB: 'https://localhost:10443/dstack/butterfly',
        },
      },
    ];

    const userContacts: UserContact[] = [
      {
        contactRef: 'USER_0_TELEGRAM_REF',
        contactService: ThirdPartyContactService.TELEGRAM,
        userEmail: users[0].email,
      },
    ];

    const createSubscriptionBodies: CreateSubscriptionBody[] = [];

    // tslint:disable-next-line: max-line-length
    const endpoint = `/subscriptions/users/${users[0].email}/projects/${projects[0].projectName}/event-types/${ServiceEventType.GITLAB_COMMIT_CREATED}`;

    await createSubscriptionsWithInitialization(
      databaseConnection,
      {
        createSubscriptionBodies,
        projects,
        userContacts,
        users,
      },
    );
    supertest(server)
      .get(endpoint)
      .expect('Content-Type', /application\/json/)
      .expect(response => {
        expect(response.body).toHaveProperty('error');
      })
      .expect(404, done);
  });
});

describe(`PATCH /subscriptions/users/:userEmail/projects/:projectName/event-types/:eventType`, () => {
  it(`Should return ParseSyntaxError if the body request isn't a valid JSON`, done => {
    const payload = '{"keywords":[}';
    const userEmail = 'email@email.it';
    const projectName = 'asd';
    const eventType = ServiceEventType.GITLAB_COMMIT_CREATED;
    const endpoint = `/subscriptions/users/${userEmail}/projects/${projectName}/event-types/${eventType}`;

    supertest(server)
      .patch(endpoint)
      .set('Content-Type', 'application/json')
      .send(payload)
      .expect('Content-Type', /application\/json/)
      .expect(response => {
        expect(response.body).not.toHaveProperty('data');
        expect(response.body).toHaveProperty('error');
        expect(response.body).toMatchObject(new ParseSyntaxError('body').toJSON());
      })
      .expect(400, done);
  });

  it(`Should update a subscription if at least the keywords field is changed`, async done => {
    const users: User[] = [
      {
        email: 'alberto.schiabel@gmail.com',
        enabled: true,
        firstname: 'Alberto',
        lastname: 'Schiabel',
        userId: '1',
      },
    ];

    const projects: Project[] = [
      {
        projectId: '1',
        projectName: 'Butterfly',
        projectURL: {
          GITLAB: 'https://localhost:10443/dstack/butterfly',
        },
      },
    ];

    const user = users[0];
    const project = projects[0];

    const userContacts: UserContact[] = [
      {
        contactRef: 'TELEGRAM_REF',
        contactService: ThirdPartyContactService.TELEGRAM,
        userEmail: user.email,
      },
      {
        contactRef: 'EMAIL_REF',
        contactService: ThirdPartyContactService.EMAIL,
        userEmail: user.email,
      },
    ];

    const createSubscriptionBodies: CreateSubscriptionBody[] = [
      {
        contactServices: [userContacts[0].contactService, userContacts[1].contactService],
        eventType: ServiceEventType.GITLAB_ISSUE_CREATED,
        keywords: ['BUG', 'FIX', 'CLOSE'],
        projectName: project.projectName,
        userEmail: user.email,
        userPriority: UserPriority.LOW,
      },
    ];

    const createSubscriptionBody = createSubscriptionBodies[0];
    const updateSubscriptionBody: UpdateSubscriptionBody = {
      keywords: ['NEW', 'KEYWORDS', 'FOR', 'SUBSCRIPTION'],
    };
    const expectedSubscriptionResult: Subscription = {
      contacts: {
        EMAIL: 'EMAIL_REF',
        TELEGRAM: 'TELEGRAM_REF',
      },
      eventType: createSubscriptionBody.eventType,
      // the returned keyword list should be sorted
      keywords: [
        'FOR',
        'KEYWORDS',
        'NEW',
        'SUBSCRIPTION',
      ],
      projectName: createSubscriptionBody.projectName,
      userEmail: createSubscriptionBody.userEmail,
      userPriority: createSubscriptionBody.userPriority,
    };

    // tslint:disable-next-line: max-line-length
    const endpoint = `/subscriptions/users/${user.email}/projects/${project.projectName}/event-types/${createSubscriptionBody.eventType}`;

    const { transaction } = await createSubscriptionsWithInitialization(
      databaseConnection,
      {
        createSubscriptionBodies,
        projects,
        userContacts,
        users,
      },
    );

    transaction()
      .then(() => {
        supertest(server)
          .patch(endpoint)
          .send(updateSubscriptionBody)
          .expect('Content-Type', /application\/json/)
          .expect(response => {
            expect(response.body).toHaveProperty('data');
            expect(response.body.data).toMatchObject(expectedSubscriptionResult);

            /**
             * data.subscriptionId should be of type string.
             */
            expect(response.body.data).toHaveProperty('subscriptionId');
            expect(typeof response.body.data.subscriptionId).toBe('string');
          })
          .expect(200, done);
      })
      .catch(e => {
        expect(e).toBe(undefined);
      });
  });

  it(`Should update a user if at least the userPriority field is changed`, async done => {
    const users: User[] = [
      {
        email: 'alberto.schiabel@gmail.com',
        enabled: true,
        firstname: 'Alberto',
        lastname: 'Schiabel',
        userId: '1',
      },
    ];

    const projects: Project[] = [
      {
        projectId: '1',
        projectName: 'Butterfly',
        projectURL: {
          GITLAB: 'https://localhost:10443/dstack/butterfly',
        },
      },
    ];

    const user = users[0];
    const project = projects[0];

    const userContacts: UserContact[] = [
      {
        contactRef: 'TELEGRAM_REF',
        contactService: ThirdPartyContactService.TELEGRAM,
        userEmail: user.email,
      },
      {
        contactRef: 'EMAIL_REF',
        contactService: ThirdPartyContactService.EMAIL,
        userEmail: user.email,
      },
    ];

    const createSubscriptionBodies: CreateSubscriptionBody[] = [
      {
        contactServices: [userContacts[0].contactService, userContacts[1].contactService],
        eventType: ServiceEventType.GITLAB_ISSUE_CREATED,
        keywords: ['BUG', 'FIX', 'CLOSE'],
        projectName: project.projectName,
        userEmail: user.email,
        userPriority: UserPriority.LOW,
      },
    ];

    const createSubscriptionBody = createSubscriptionBodies[0];
    const updateSubscriptionBody: UpdateSubscriptionBody = {
      userPriority: UserPriority.HIGH,
    };
    const expectedSubscriptionResult: Subscription = {
      contacts: {
        EMAIL: 'EMAIL_REF',
        TELEGRAM: 'TELEGRAM_REF',
      },
      eventType: createSubscriptionBody.eventType,
      // the returned keyword list should be sorted
      keywords: [
        'BUG',
        'CLOSE',
        'FIX',
      ],
      projectName: createSubscriptionBody.projectName,
      userEmail: createSubscriptionBody.userEmail,
      userPriority: updateSubscriptionBody.userPriority!,
    };

    // tslint:disable-next-line: max-line-length
    const endpoint = `/subscriptions/users/${user.email}/projects/${project.projectName}/event-types/${createSubscriptionBody.eventType}`;

    const { transaction } = await createSubscriptionsWithInitialization(
      databaseConnection,
      {
        createSubscriptionBodies,
        projects,
        userContacts,
        users,
      },
    );

    transaction()
      .then(() => {
        supertest(server)
          .patch(endpoint)
          .send(updateSubscriptionBody)
          .expect('Content-Type', /application\/json/)
          .expect(response => {
            expect(response.body).toHaveProperty('data');
            expect(response.body.data).toMatchObject(expectedSubscriptionResult);

            /**
             * data.subscriptionId should be of type string.
             */
            expect(response.body.data).toHaveProperty('subscriptionId');
            expect(typeof response.body.data.subscriptionId).toBe('string');
          })
          .expect(200, done);
      })
      .catch(e => {
        expect(e).toBe(undefined);
      });
  });

  it(`Should update a user if at least the contactServices field is changed`, async done => {
    const users: User[] = [
      {
        email: 'alberto.schiabel@gmail.com',
        enabled: true,
        firstname: 'Alberto',
        lastname: 'Schiabel',
        userId: '1',
      },
    ];

    const projects: Project[] = [
      {
        projectId: '1',
        projectName: 'Butterfly',
        projectURL: {
          GITLAB: 'https://localhost:10443/dstack/butterfly',
        },
      },
    ];

    const user = users[0];
    const project = projects[0];

    const userContacts: UserContact[] = [
      {
        contactRef: 'TELEGRAM_REF',
        contactService: ThirdPartyContactService.TELEGRAM,
        userEmail: user.email,
      },
      {
        contactRef: 'EMAIL_REF',
        contactService: ThirdPartyContactService.EMAIL,
        userEmail: user.email,
      },
    ];

    const createSubscriptionBodies: CreateSubscriptionBody[] = [
      {
        contactServices: [userContacts[0].contactService, userContacts[1].contactService],
        eventType: ServiceEventType.GITLAB_ISSUE_CREATED,
        keywords: ['BUG', 'FIX', 'CLOSE'],
        projectName: project.projectName,
        userEmail: user.email,
        userPriority: UserPriority.LOW,
      },
    ];

    const createSubscriptionBody = createSubscriptionBodies[0];
    const updateSubscriptionBody: UpdateSubscriptionBody = {
      contactServices: [userContacts[1].contactService],
    };
    const expectedSubscriptionResult: Subscription = {
      contacts: {
        EMAIL: 'EMAIL_REF',
      },
      eventType: createSubscriptionBody.eventType,
      // the returned keyword list should be sorted
      keywords: [
        'BUG',
        'CLOSE',
        'FIX',
      ],
      projectName: createSubscriptionBody.projectName,
      userEmail: createSubscriptionBody.userEmail,
      userPriority: createSubscriptionBody.userPriority,
    };

    // tslint:disable-next-line: max-line-length
    const endpoint = `/subscriptions/users/${user.email}/projects/${project.projectName}/event-types/${createSubscriptionBody.eventType}`;

    const { transaction } = await createSubscriptionsWithInitialization(
      databaseConnection,
      {
        createSubscriptionBodies,
        projects,
        userContacts,
        users,
      },
    );

    transaction()
      .then(() => {
        supertest(server)
          .patch(endpoint)
          .send(updateSubscriptionBody)
          .expect('Content-Type', /application\/json/)
          .expect(response => {
            expect(response.body).toHaveProperty('data');
            expect(response.body.data).toMatchObject(expectedSubscriptionResult);

            /**
             * data.subscriptionId should be of type string.
             */
            expect(response.body.data).toHaveProperty('subscriptionId');
            expect(typeof response.body.data.subscriptionId).toBe('string');
          })
          .expect(200, done);
      })
      .catch(e => {
        expect(e).toBe(undefined);
      });
  });
});

describe(`DELETE /subscriptions/users/:userEmail/projects/:projectName/event-types/:eventType`, () => {
  it(`Should delete a transaction if it exists`, async done => {
    const users: User[] = [
      {
        email: 'alberto.schiabel@gmail.com',
        enabled: true,
        firstname: 'Alberto',
        lastname: 'Schiabel',
        userId: '1',
      },
    ];

    const projects: Project[] = [
      {
        projectId: '1',
        projectName: 'Butterfly',
        projectURL: {
          GITLAB: 'https://localhost:10443/dstack/butterfly',
        },
      },
    ];

    const user = users[0];
    const project = projects[0];

    const userContacts: UserContact[] = [
      {
        contactRef: 'TELEGRAM_REF',
        contactService: ThirdPartyContactService.TELEGRAM,
        userEmail: user.email,
      },
      {
        contactRef: 'EMAIL_REF',
        contactService: ThirdPartyContactService.EMAIL,
        userEmail: user.email,
      },
    ];

    const createSubscriptionBodies: CreateSubscriptionBody[] = [
      {
        contactServices: [userContacts[0].contactService, userContacts[1].contactService],
        eventType: ServiceEventType.GITLAB_ISSUE_CREATED,
        keywords: ['BUG', 'FIX', 'CLOSE'],
        projectName: project.projectName,
        userEmail: user.email,
        userPriority: UserPriority.LOW,
      },
    ];

    const createSubscriptionBody = createSubscriptionBodies[0];
    // tslint:disable-next-line: max-line-length
    const endpoint = `/subscriptions/users/${user.email}/projects/${project.projectName}/event-types/${createSubscriptionBody.eventType}`;

    const { transaction } = await createSubscriptionsWithInitialization(
      databaseConnection,
      {
        createSubscriptionBodies,
        projects,
        userContacts,
        users,
      },
    );

    transaction()
      .then(() => {
        supertest(server)
          .delete(endpoint)
          .expect('Content-Type', /application\/json/)
          .expect(response => {
            expect(response.body).toHaveProperty('data');
            expect(response.body.data).toBe(null);
          })
          .expect(200, done);
      })
      .catch(e => {
        expect(e).toBe(undefined);
      });
  });

  it(`Should return a NotFoundError if attempting to delete a user contact that doesn't exist
      linked to a user that exists`, async done => {
    const users: User[] = [
      {
        email: 'alberto.schiabel@gmail.com',
        enabled: true,
        firstname: 'Alberto',
        lastname: 'Schiabel',
        userId: '1',
      },
    ];

    const projects: Project[] = [
      {
        projectId: '1',
        projectName: 'Butterfly',
        projectURL: {
          GITLAB: 'https://localhost:10443/dstack/butterfly',
        },
      },
    ];

    const user = users[0];
    const project = projects[0];

    const userContacts: UserContact[] = [
      {
        contactRef: 'TELEGRAM_REF',
        contactService: ThirdPartyContactService.TELEGRAM,
        userEmail: user.email,
      },
      {
        contactRef: 'EMAIL_REF',
        contactService: ThirdPartyContactService.EMAIL,
        userEmail: user.email,
      },
    ];

    const createSubscriptionBodies: CreateSubscriptionBody[] = [
      {
        contactServices: [userContacts[0].contactService, userContacts[1].contactService],
        eventType: ServiceEventType.GITLAB_ISSUE_CREATED,
        keywords: ['BUG', 'FIX', 'CLOSE'],
        projectName: project.projectName,
        userEmail: user.email,
        userPriority: UserPriority.LOW,
      },
    ];

    const createSubscriptionBody = createSubscriptionBodies[0];

    // tslint:disable-next-line: max-line-length
    const endpoint = `/subscriptions/users/${user.email}/projects/${project.projectName}/event-types/${createSubscriptionBody.eventType}`;

    await createSubscriptionsWithInitialization(
      databaseConnection,
      {
        createSubscriptionBodies,
        projects,
        userContacts,
        users,
      },
    );

    supertest(server)
      .delete(endpoint)
      .expect('Content-Type', /application\/json/)
      .expect(response => {
        expect(response.body).not.toHaveProperty('data');
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toBe(true);
      })
      .expect(404, done);
  });
});
