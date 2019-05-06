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
