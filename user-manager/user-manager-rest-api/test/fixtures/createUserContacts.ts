/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    user-manager-rest-api
 * @fileName:  createUserContacts.ts
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
import { CreateUserContact, UserContact } from '../../src/modules/userContacts/entity';

const query = `SELECT *
               FROM public.create_user_contact(
                 $[userEmail],
                 $[contactService],
                 $[contactRef]
               )`;

export const createUserContactsQuery = query;

export interface CreateUserContactResult {
  result: UserContact;
  transaction: () => Promise<void>;
}

export function createUserContact(database: PgDatabaseConnection, params: CreateUserContact): CreateUserContactResult {
  const userContactResult: UserContact = {
    ...params,
  };

  const getUserContactQuery: GetQueries<UserContact> = t => {
    const userContactQuery = t.any(query, params);
    return [userContactQuery];
  };

  return {
    result: userContactResult,
    transaction: () => database.transaction(getUserContactQuery),
  };
}

export interface CreateUserContactsResult {
  results: UserContact[];
  transaction: () => Promise<void>;
}

export function createUserContacts(
  database: PgDatabaseConnection,
  userContacts: CreateUserContact[],
): CreateUserContactsResult {
  const getUserContactQueries: GetQueries<UserContact> = t => {
    return userContacts.map(user => t.any(query, user));
  };

  return {
    results: userContacts,
    transaction: () => database.transaction(getUserContactQueries),
  };
}
