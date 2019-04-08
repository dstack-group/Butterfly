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
