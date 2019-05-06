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

import { ValidateCallback, ValidatorObject } from '../../common/Validation';
import { ServiceEventType } from '../../common/Event';
import { ThirdPartyContactService } from '../../common/ThirdPartyContactService';
import { UserPriority } from '../../common/UserPriority';
import { getEnumValues } from '../../utils/getEnumValues';

const maxProjectNameLength = 50;
const keywordsLength = {
  max: 5,
  min: 1,
};
const contactServicesLength = {
  max: 3,
  min: 1,
};

const validateParams = (validator: ValidatorObject) => ({
  eventType: validator.string()
  .valid(getEnumValues(ServiceEventType))
  .required(),
  projectName: validator.string()
    .trim()
    .max(maxProjectNameLength)
    .required(),
  userEmail: validator.string()
    .email()
    .trim()
    .required(),
});

const validateBody = (validator: ValidatorObject) => ({
  contactServices: validator.array()
    .min(contactServicesLength.min)
    .max(contactServicesLength.max)
    .items(validator.string()
      .valid(getEnumValues(ThirdPartyContactService)),
    ),
  keywords: validator.array()
    .min(keywordsLength.min)
    .max(keywordsLength.max)
    .items(validator.string()),
  userPriority: validator.string()
    .valid(getEnumValues(UserPriority)),
});

export const validateCreateSubscriptionBody: ValidateCallback = (validator => {
  const { contactServices, keywords, userPriority } = validateBody(validator);
  return {
    ...validateParams(validator),
    contactServices: contactServices.required(),
    keywords: keywords.required(),
    userPriority: userPriority.required(),
  };
});

export const validateUpdateSubscriptionBody: ValidateCallback = (validator => validateBody(validator));

export const validateSubscriptionParams: ValidateCallback = (validator => validateParams(validator));

export const validateUserEmailParam: ValidateCallback = (validator => ({
  userEmail: validator.string()
    .email()
    .trim()
    .required(),
}));
