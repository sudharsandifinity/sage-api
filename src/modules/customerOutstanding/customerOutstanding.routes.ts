import { Router } from 'express';
import { validate } from '../../middleware/validate.js';
import { importOutstandingHandler } from './customerOutstanding.controller.js';
import { importOutstandingQuerySchema } from './customerOutstanding.schema.js';

export const customerOutstandingRouter = Router();

customerOutstandingRouter.post(
  '/import',
  validate({ query: importOutstandingQuerySchema }),
  importOutstandingHandler,
);
