import * as Joi from 'joi';
import { Middleware } from '../router/Router';
import { FieldValidationError } from '../errors';
import { ValidationErrorItem } from './ValidationErrorItem';

export interface RequestSchema {
  body?: {
    [key: string]: Joi.SchemaLike;
  };
  queryString?: {
    [key: string]: Joi.SchemaLike;
  };
  params?: {
    [key: string]: Joi.SchemaLike;
  };
}

/**
 * Middleware that checks that the JSON body of the current request respects is structured correctly
 * according to the given `schema`.
 * If it isn't, a `FieldValidationError` exception is thrown.
 * @param schema
 */
export function validateRequest(schema: RequestSchema): Middleware {
  schema.params = schema.params || undefined;
  schema.queryString = schema.queryString || undefined;
  return async (ctx, next) => {
    const { request } = ctx;
    const abstractedContext = {
      body: request.body,
      // params: ctx.params,
      // queryString: request.querystring,
    };

    const valResult = Joi.validate(abstractedContext, schema, {
      abortEarly: true,
      allowUnknown: false,
    });

    if (valResult.error) {
      const { message, details } = valResult.error;
      const fieldErrors: ValidationErrorItem[] = details.map(f => ({
        message: f.message,
        path: f.path,
        type: f.type,
      }));

      throw new FieldValidationError(message, fieldErrors);
    }

    await next();
  };
}
