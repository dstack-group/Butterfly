/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    user-manager-rest-api
 * @fileName:  validator.ts
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

import { ValidateCallback } from '../../common/Validation';
import { ThirdPartyContactService } from '../../common/ThirdPartyContactService';

export const validateContactServiceUserEmailParams: ValidateCallback = (validator => ({
  contactService: validator.string()
    .valid([
      ThirdPartyContactService.TELEGRAM,
      ThirdPartyContactService.SLACK,
      ThirdPartyContactService.EMAIL,
    ]),
  userEmail: validator.string()
    .email()
    .trim()
    .required(),
}));

export const validateCreateUserContactBody: ValidateCallback = (validator => ({
  contactRef: validator.string()
    .required(),
  userEmail: validator.string()
    .email()
    .trim()
    .required(),
}));

export const validateUpdateUserContactBody: ValidateCallback = (validator => ({
  contactRef: validator.string()
    .required(),
}));

export const validateContactServiceParam: ValidateCallback = (validator => ({
  contactService: validator.string()
    .valid([
      ThirdPartyContactService.TELEGRAM,
      ThirdPartyContactService.SLACK,
      ThirdPartyContactService.EMAIL,
    ]),
}));

export const validateUserEmailParam: ValidateCallback = (validator => ({
  userEmail: validator.string()
    .email()
    .trim()
    .required(),
}));
