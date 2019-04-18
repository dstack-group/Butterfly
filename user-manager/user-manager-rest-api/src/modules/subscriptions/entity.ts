import { UserPriority } from '../../common/UserPriority';
import { ServiceEventType } from '../../common/Event';
import { ThirdPartyContactService } from '../../common/ThirdPartyContactService';

export interface CreateSubscription {
  contactServices: ThirdPartyContactService[];
  eventType: ServiceEventType;
  keywords: string[];
  projectName: string;
  userEmail: string;
  userPriority: UserPriority;
}

export interface Subscription {
  eventType: ServiceEventType;
  keywordList: string[]; // each keyword associated with this subscription
  projectName: string;
  subscriptionId: string;
  userContactMap: {
    [key in ThirdPartyContactService]?: string;
  };
  userEmail: string;
  userPriority: UserPriority;
}
