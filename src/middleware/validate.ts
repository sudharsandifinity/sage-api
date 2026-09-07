import type { RequestHandler } from 'express';
import type { z } from 'zod';

export interface ValidationSchemas {
  body?: z.ZodType;
  query?: z.ZodType;
  params?: z.ZodType;
}

export const validate = (schemas: ValidationSchemas): RequestHandler => {
  return (req, _res, next) => {
    try {
      req.validated = {
        body: schemas.body ? schemas.body.parse(req.body) : req.body,
        query: schemas.query ? schemas.query.parse(req.query) : req.query,
        params: schemas.params ? schemas.params.parse(req.params) : req.params,
      };
      next();
    } catch (error) {
      next(error);
    }
  };
};

export const validatedQuery = <T>(req: { validated?: { query: unknown } }): T =>
  req.validated?.query as T;

export const validatedBody = <T>(req: { validated?: { body: unknown } }): T =>
  req.validated?.body as T;

export const validatedParams = <T>(req: { validated?: { params: unknown } }): T =>
  req.validated?.params as T;
