import { Router } from 'express';
import { validate } from '../../middleware/validate.js';
import { listCustomersHandler } from './customers.controller.js';
import { listCustomersQuerySchema } from './customers.schema.js';

export const customersRouter = Router();

customersRouter.get(
  '/',
  validate({ query: listCustomersQuerySchema }),
  listCustomersHandler,
);
