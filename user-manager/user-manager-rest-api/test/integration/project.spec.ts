import { setupTests } from '../init';
import supertest from 'supertest';
import { Server as AppServer } from '../../src/server';
import { Server } from 'http';
import { truncData } from '../fixtures/truncData';
import { PgDatabaseConnection } from '../../src/database';
import { createProjects, createProject } from '../fixtures/createProjects';
import { isValidDate } from '../isValidDate';
import { Project } from '../../src/modules/projects/entity';
import { ThirdPartyProducerService } from '../../src/common/ThirdPartyProducerService';

let app: AppServer;
let server: Server;
let databaseConnection: PgDatabaseConnection;

/**
 * Spins up a new HTTP server and a new database connection before each test executes.
 * It also removes the database rows every time, ensuring that the only things left definted
 * in the database are tables, functions, procedures and views.
 */
beforeEach(done => {
  const setup = setupTests();
  app = setup.app;
  server = setup.server;
  databaseConnection = setup.databaseConnection;
  truncData(databaseConnection).then(done);
});

afterEach(done => {
  app.closeServer().then(done);
});

describe(`GET /projects`, () => {
  it(`The response data should be ordered by id and match the objects inserted into the database`, done => {
    const { transaction, results } = createProjects(databaseConnection);
    transaction
      .then(() => {
        supertest(server)
          .get('/projects')
          .expect('Content-Type', /application\/json/)
          .expect(response => {
            expect(response.body).toHaveProperty('data');
            expect(response.body.data.length).toBe(results.length);
            (response.body.data as unknown[]).forEach((obj, i) => {
              const currentResult = results[i];
              expect(obj).toMatchObject(currentResult);
              expect(obj).toHaveProperty('created');
            });
          })
          .expect(200, done);
      })
      .catch(e => {
        expect(e).toBe(undefined);
      });
  });

  it(`The response data should be an empty array if no project is saved`, done => {
    supertest(server)
      .get('/projects')
      .expect('Content-Type', /application\/json/)
      .expect(response => {
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toEqual([]);
      })
      .expect(200, done);
  });
});

describe(`POST /projects`, () => {
  it(`Should fail if another project with the same name already exists`, done => {
    const { transaction, result } = createProject(databaseConnection);
    const { projectName } = result;
    const project: Project = {
      projectName,
      projectURL: {
        GITLAB: 'http://gitlab',
      },
    };
    transaction
      .then(() => {
        supertest(server)
          .post('/projects')
          .send(project)
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

  it(`Should return the newly inserted project if the INSERT operation is successful`, done => {
    const project: Project = {
      projectName: 'PROJECT_NAME',
      projectURL: {
        GITLAB: 'http://gitlab',
      },
    };
    supertest(server)
      .post('/projects')
      .send(project)
      .expect('Content-Type', /application\/json/)
      .expect(response => {
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toMatchObject({
          modified: null,
          projectName: 'PROJECT_NAME',
          projectURL: {
            GITLAB: 'http://gitlab',
          },
        });

        /**
         * data.created must be a valid date.
         */
        expect(response.body.data).toHaveProperty('created');
        expect(isValidDate(response.body.data.created)).toBe(true);

        /**
         * data.projectId should be of type string.
         */
        expect(response.body.data).toHaveProperty('projectId');
        expect(typeof response.body.data.projectId).toBe('string');
      })
    .expect(201, done);
  });
});

describe(`DELETE /projects/:projectName`, () => {
  it(`Should delete a project if it exists`, done => {
    const { transaction, result } = createProject(databaseConnection);
    const { projectName } = result;

    transaction
      .then(() => {
        supertest(server)
          .delete(`/projects/${projectName}`)
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

  it(`Should return a NotFoundError if attempting to delete a project that doesn't exist`, done => {
    supertest(server)
      .delete(`/projects/PROJECT_NAME`)
      .expect('Content-Type', /application\/json/)
      .expect(response => {
        expect(response.body).not.toHaveProperty('data');
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toBe(true);
      })
      .expect(404, done);
  });
});

describe(`DELETE /projects/:projectName/:producerService`, () => {
  it(`Should delete a project if it exists`, done => {
    const { transaction, result } = createProject(databaseConnection);
    const { projectId, projectName, projectURL } = result;

    transaction
      .then(() => {
        supertest(server)
          .delete(`/projects/${projectName}/${ThirdPartyProducerService.GITLAB}`)
          .expect('Content-Type', /application\/json/)
          .expect(response => {
            expect(response.body).toHaveProperty('data');
            expect(response.body.data).toMatchObject({
              projectId,
              projectName,
              projectURL: {
                [ThirdPartyProducerService.REDMINE]: projectURL![ThirdPartyProducerService.REDMINE]!,
              },
            });
          })
          .expect(200, done);
      })
      .catch(e => {
        expect(e).toBe(undefined);
      });
  });

  it(`Should return a NotFoundError if attempting to delete a service URL from a project
      that doesn't exist`, done => {
    supertest(server)
      .delete(`/projects/PROJECT_NAME/${ThirdPartyProducerService.GITLAB}`)
      .expect('Content-Type', /application\/json/)
      .expect(response => {
        expect(response.body).not.toHaveProperty('data');
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toBe(true);
      })
      .expect(404, done);
  });
});
