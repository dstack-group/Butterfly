import { ThirdPartyContactService } from '../../common/ThirdPartyContactService';

export interface CreateUserContactURLParams {
  userEmail: string;
  contactService: ThirdPartyContactService;
}

export interface CreateUserContact extends CreateUserContactURLParams {
  contactRef: string;
}

export interface UserContact extends CreateUserContact {
  userContactId?: string;
}
