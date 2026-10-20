import { Router } from 'express';
import { validate } from '../../middleware/validate.js';
import { importCustomersHandler } from './customerMaster.controller.js';
import { importCustomersQuerySchema } from './customerMaster.schema.js';

export const customerMasterRouter = Router();

customerMasterRouter.post(
  '/import',
  validate({ query: importCustomersQuerySchema }),
  importCustomersHandler,
);
