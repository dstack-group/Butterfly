import { ThirdPartyContactService } from '../../common/ThirdPartyContactService';

export type ContactInfo = {
  readonly [key in ThirdPartyContactService]?: string;
};

export interface EventReceiver {
  firstname: string;
  lastname: string;
  contactInfo: ContactInfo;
}

export interface EventReceiversResult {
  userContactList: EventReceiver[];
}
