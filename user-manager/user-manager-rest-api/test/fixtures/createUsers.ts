import { PgDatabaseConnection, GetQueries } from '../../src/database';

const query = `INSERT INTO public.user(user_id, email, firstname, lastname)
               VALUES($[userId], $[email], $[firstname], $[lastname])`;

const commonValues = {
  enabled: true,
  modified: null,
};

export function createUser(database: PgDatabaseConnection) {
  const userResult = {
    email: 'alberto.schiabel@gmail.com',
    firstname: 'Alberto',
    lastname: 'Schiabel',
    userId: '1',
    ...commonValues,
  };

  const getUserQuery: GetQueries<unknown> = t => {
    const { email, firstname, lastname, userId } = userResult;
    const createUserQuery = t.any(query, {
      email,
      firstname,
      lastname,
      userId,
    });

    return [createUserQuery];
  };

  return {
    result: userResult,
    transaction: database.transaction(getUserQuery),
  };
}

export function createUsers(database: PgDatabaseConnection) {
  const userResults = [
    {
      email: 'alberto.schiabel@gmail.com',
      firstname: 'Alberto',
      lastname: 'Schiabel',
      userId: '1',
      ...commonValues,
    }, {
      email: 'federico.rispo@gmail.com',
      firstname: 'Federico',
      lastname: 'Rispo',
      userId: '2',
      ...commonValues,
    }, {
      email: 'enrico.trinco@gmail.com',
      firstname: 'Enrico',
      lastname: 'Trinco',
      userId: '3',
      ...commonValues,
    }, {
      email: 'eleonorasignor@gmail.com',
      firstname: 'Eleonora',
      lastname: 'Signor',
      userId: '4',
      ...commonValues,
    }, {
      email: 'TheAlchemist97@gmail.com',
      firstname: 'Niccolò',
      lastname: 'Vettorello',
      userId: '5',
      ...commonValues,
    }, {
      email: 'elton97@gmail.com',
      firstname: 'Elton',
      lastname: 'Stafa',
      userId: '6',
      ...commonValues,
    }, {
      email: 'singh@gmail.com',
      firstname: 'Harwinder',
      lastname: 'Singh',
      userId: '7',
      ...commonValues,
    },
  ];

  const getUserQueries: GetQueries<unknown> = t => {
    const createUserQueries: Array<Promise<Array<unknown>>> =
      userResults.map(({ email, firstname, lastname, userId }) => {
        return t.any(query, {
          email,
          firstname,
          lastname,
          userId,
        });
      });

    return createUserQueries;
  };

  return {
    results: userResults,
    transaction: database.transaction(getUserQueries),
  };
}
