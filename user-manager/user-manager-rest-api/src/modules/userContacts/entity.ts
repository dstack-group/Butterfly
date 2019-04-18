import { ThirdPartyContactService } from '../../common/ThirdPartyContactService';

export interface CreateUserContactURLParams {
  contactService: ThirdPartyContactService;
  userEmail?: string; // only in DELETE
}

export interface CreateUserContact extends CreateUserContactURLParams {
  userEmail: string;
  contactRef: string;
}

export interface UserContact extends CreateUserContact {
  userContactId?: string;
}
