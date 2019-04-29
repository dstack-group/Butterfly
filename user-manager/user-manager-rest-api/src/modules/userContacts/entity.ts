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

import { ThirdPartyContactService } from '../../common/ThirdPartyContactService';

export interface UserEmail {
  userEmail: string;
}

export interface ContactRef {
  contactRef: string;
}

export interface ContactServiceUserEmailURLParams {
  contactService: ThirdPartyContactService;
  userEmail: string;
}

export type UserContactInfo = {
  [key in ThirdPartyContactService]?: string;
};

export interface UserContactInfoData {
  data: UserContactInfo;
}

export interface CreateUserContactURLParams {
  contactService: ThirdPartyContactService;
  userEmail?: string; // only in DELETE
}

export interface CreateUserContact extends CreateUserContactURLParams, ContactRef {

}

export interface UpdateUserContact extends CreateUserContactURLParams, ContactRef {

}

export interface UserContact extends CreateUserContact {
  userContactId?: string;
}
