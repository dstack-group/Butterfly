/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    user-manager-rest-api
 * @fileName:  entity.ts
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

export interface UserEmail {
  email: string;
}

export interface CreateUser extends UserEmail {
  firstname: string;
  lastname: string;
  enabled?: boolean;
}

export interface User extends CreateUser {
  created?: string;
  modified?: string | null;
  userId: string;
}

/**
 * UpdateUserBody is used to update a user record. It's the type of the PATCH body payload.
 * The `email` property is excluded because it's read from the querystring params.
 */
export interface UpdateUserBody extends Partial<Pick<CreateUser, Exclude<keyof CreateUser, 'email'>>> {

}

export interface UpdateUser extends Partial<CreateUser> {

}
