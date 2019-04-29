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

import * as Joi from 'joi';

export const createUser: Joi.SchemaMap = {
  email: Joi.string()
    .email()
    .trim()
    .required(),
  firstname: Joi.string().required(),
  lastname: Joi.string().required(),
};

export const updateUser: Joi.SchemaMap = {
  email: Joi.string()
    .email()
    .trim()
    .required(),
  enabled: Joi.boolean(),
  firstname: Joi.string(),
  lastname: Joi.string(),
};
