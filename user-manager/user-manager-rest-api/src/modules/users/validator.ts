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

export const validateCreateUserBody: ValidateCallback = (validator => ({
  email: validator.string()
    .email()
    .trim()
    .required(),
  enabled: validator.boolean(),
  firstname: validator.string().required(),
  lastname: validator.string().required(),
}));

export const validateUpdateUserBody: ValidateCallback = (validator => ({
  enabled: validator.boolean(),
  firstname: validator.string(),
  lastname: validator.string(),
}));

export const validateEmailParam: ValidateCallback = (validator => ({
  email: validator.string()
    .email()
    .trim()
    .required(),
}));
