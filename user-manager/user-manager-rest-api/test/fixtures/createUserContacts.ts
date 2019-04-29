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
  transaction: Promise<void>;
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
    transaction: database.transaction(getUserContactQuery),
  };
}

/*
export function createUserContacts(database: PgDatabaseConnection): Promise<void> {
  const getUserContactQueries: GetQueries<unknown> = t => {
    const createUserContactQueries: Array<Promise<Array<unknown>>> = [];
    createUserContactQueries.push(t.any(query, {
      contactRef: 'jkomyno',
      contactType: ThirdPartyContactService.TELEGRAM,
      userId: 1,
    }));
    createUserContactQueries.push(t.any(query, {
      contactRef: 'jkomyno',
      contactType: ThirdPartyContactService.SLACK,
      userId: 1,
    }));
    createUserContactQueries.push(t.any(query, {
      contactRef: 'alberto.schiabel@gmail.com',
      contactType: ThirdPartyContactService.EMAIL,
      userId: 1,
    }));
    createUserContactQueries.push(t.any(query, {
      contactRef: 'frispo',
      contactType: ThirdPartyContactService.TELEGRAM,
      userId: 2,
    }));
    createUserContactQueries.push(t.any(query, {
      contactRef: 'frispo@gmail.com',
      contactType: ThirdPartyContactService.EMAIL,
      userId: 2,
    }));
    createUserContactQueries.push(t.any(query, {
      contactRef: 'enrico_dogen',
      contactType: ThirdPartyContactService.TELEGRAM,
      userId: 3,
    }));
    createUserContactQueries.push(t.any(query, {
      contactRef: 'enrico_dogen',
      contactType: ThirdPartyContactService.TELEGRAM,
      userId: 3,
    }));
    createUserContactQueries.push(t.any(query, {
      contactRef: 'eleonora_signor',
      contactType: ThirdPartyContactService.TELEGRAM,
      userId: 4,
    }));
    createUserContactQueries.push(t.any(query, {
      contactRef: 'eleonora_signor@gmail.com',
      contactType: ThirdPartyContactService.EMAIL,
      userId: 4,
    }));

    return createUserContactQueries;
  };

  return database.transaction(getUserContactQueries);
}
*/
