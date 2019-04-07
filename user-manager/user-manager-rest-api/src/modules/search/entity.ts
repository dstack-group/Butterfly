import { User } from '../users/entity';
import { ThirdPartyContactService } from '../../common/ThirdPartyContactService';

export type ContactInfo = {
  readonly [key in ThirdPartyContactService]: {
    contact_ref: string;
  };
};

export interface UserContactsInfo {
  user: User;
  contacts: ContactInfo[];
}

export interface EventWithRecipients {
  entityId: string;
  entityType: string;
  projectName: string;
  projectURL?: string;
  title: string;
  description: string;
  userContacts: UserContactsInfo[];
}
