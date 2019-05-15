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

import { UserPriority } from '../../common/UserPriority';
import { ServiceEventType } from '../../common/Event';
import { ThirdPartyContactService } from '../../common/ThirdPartyContactService';

export interface UserEmail {
  userEmail: string;
}

export interface SubscriptionParams extends UserEmail {
  eventType: ServiceEventType;
  projectName: string;
}

export interface CreateSubscriptionBody extends SubscriptionParams {
  contactServices: ThirdPartyContactService[];
  keywords: string[];
  userPriority: UserPriority;
}

export interface UpdateSubscriptionBody {
  contactServices?: ThirdPartyContactService[];
  keywords?: string[];
  userPriority?: UserPriority;
}

export interface UpdateSubscription extends SubscriptionParams, UpdateSubscriptionBody {

}

export interface Subscription {
  eventType: ServiceEventType;
  keywords: string[]; // each keyword associated with this subscription
  projectName: string;
  subscriptionId?: string;
  contacts: {
    [key in ThirdPartyContactService]?: string;
  };
  userEmail: string;
  userPriority: UserPriority;
}
