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

import { ThirdPartyProducerService } from '../../common/ThirdPartyProducerService';
import { ValidateCallback, ValidatorObject } from '../../common/Validation';

const maxProjectNameLength = 50;

const validateProjectURL = (validator: ValidatorObject) => validator.object().keys({
  [ThirdPartyProducerService.GITLAB]: validator.string(),
  [ThirdPartyProducerService.REDMINE]: validator.string(),
  [ThirdPartyProducerService.SONARQUBE]: validator.string(),
}).or( // https://github.com/hapijs/joi/blob/master/API.md#objectorpeers
  ThirdPartyProducerService.GITLAB,
  ThirdPartyProducerService.REDMINE,
  ThirdPartyProducerService.SONARQUBE,
).required();

export const validateCreateProjectBody: ValidateCallback = (validator => ({
  projectName: validator.string()
    .trim()
    .max(maxProjectNameLength)
    .required(),
  projectURL: validateProjectURL(validator),
}));

export const validateUpdateProjectBody: ValidateCallback = (validator => ({
  projectURL: validateProjectURL(validator),
}));

export const validateProjectNameParam: ValidateCallback = (validator => ({
  projectName: validator.string()
    .trim()
    .max(maxProjectNameLength)
    .required(),
}));

export const validateRemoveServiceFromProjectParams: ValidateCallback = (validator => ({
  producerService: validator.string()
    .valid([
      ThirdPartyProducerService.GITLAB,
      ThirdPartyProducerService.REDMINE,
      ThirdPartyProducerService.SONARQUBE,
    ]),
  projectName: validator.string()
    .trim()
    .max(maxProjectNameLength)
    .required(),
}));
