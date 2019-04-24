import { setupTests } from '../init';

describe(`Database connection`, () => {
  it(`Should connect to the test database if the server is properly setup`, done => {
    const { app } = setupTests();

    app.isConnectedToDatabase()
      .then(connected => {
        expect(connected).toBe(true);
      })
      .finally(() => {
        app.closeServer().then(done);
      });
  });

  /*
  TODO: setup a different test command that invokes only this that doesn't launch docker-compose with Postgres
  it(`Shouldn't be able to connect to the test database if the server isn't setup`, done => {
    const { app } = setupTests();

    app.isConnectedToDatabase()
      .then(connected => {
        expect(connected).toBe(false);
      })
      .finally(() => {
        app.closeServer().then(done);
      });
  });
  */
});
