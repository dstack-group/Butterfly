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
