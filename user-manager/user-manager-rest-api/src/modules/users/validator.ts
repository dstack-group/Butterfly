import * as Joi from 'joi';

export const createUser: Joi.SchemaMap = {
  email: Joi.string()
    .email()
    .trim()
    .required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
};

export const updateUser: Joi.SchemaMap = {
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
};
