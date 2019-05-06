/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    user-manager-rest-api
 * @fileName:  UserPriority.ts
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

import Joi, { SchemaLike } from '@hapi/joi';

export const Validator = Joi;

export type ValidationSchema = SchemaLike;
export type ValidatorObject = typeof Validator;

export interface ValidationErrorItem {
  message: string;
  path: string[];
  type: string;
}

export type ValidateCallback = (validator: ValidatorObject) => ValidationSchema;
