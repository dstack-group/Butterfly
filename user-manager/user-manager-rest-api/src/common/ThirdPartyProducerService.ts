/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    user-manager-rest-api
 * @fileName:  ThirdPartyProducerService.ts
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
 * List of the supported third party services that can originate events to which the user
 * can subscribe.
 */
export enum ThirdPartyProducerService {
  REDMINE = 'REDMINE',
  GITLAB = 'GITLAB',
  SONARQUBE = 'SONARQUBE',
}
