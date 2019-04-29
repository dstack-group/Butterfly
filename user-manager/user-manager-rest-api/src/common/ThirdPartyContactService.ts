/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    user-manager-rest-api
 * @fileName:  ThirdPartyContactService.ts
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

/**
 * List of the supported contact services which the user can use to receive notifications.
 */
export enum ThirdPartyContactService {
  TELEGRAM = 'TELEGRAM',
  SLACK = 'SLACK',
  EMAIL = 'EMAIL',
}
