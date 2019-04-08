import { PgDatabaseConnection, GetQueries } from '../../src/database';
import { User } from '../../src/modules/users/entity';

const query = `INSERT INTO public.user(user_id, email, firstname, lastname)
               VALUES($[userId], $[email], $[firstname], $[lastname])`;

const commonValues = {
  enabled: true,
  modified: null,
};

export interface CreateUserResult {
  result: User;
  transaction: Promise<void>;
}

export function createUser(database: PgDatabaseConnection): CreateUserResult {
  const userResult: User = {
    email: 'alberto.schiabel@gmail.com',
    firstname: 'Alberto',
    lastname: 'Schiabel',
    userId: '1',
    ...commonValues,
  };

  const getUserQuery: GetQueries<User> = t => {
    const createUserQuery = t.any(query, userResult);
    return [createUserQuery];
  };

  return {
    result: userResult,
    transaction: database.transaction(getUserQuery),
  };
}

export interface CreateUsersResult {
  results: User[];
  transaction: Promise<void>;
}

export function createUsers(database: PgDatabaseConnection): CreateUsersResult {
  const userResults: User[] = [
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

  const getUserQueries: GetQueries<User> = t => {
    return userResults.map(user => t.any(query, user));
  };

  return {
    results: userResults,
    transaction: database.transaction(getUserQueries),
  };
}
