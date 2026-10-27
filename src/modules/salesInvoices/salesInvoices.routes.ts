import { Router } from 'express';
import { validate } from '../../middleware/validate.js';
import { pushSalesInvoicesHandler } from './salesInvoices.controller.js';
import { pushSalesInvoicesQuerySchema } from './salesInvoices.schema.js';

export const salesInvoicesRouter = Router();

salesInvoicesRouter.post(
  '/push',
  validate({ query: pushSalesInvoicesQuerySchema }),
  pushSalesInvoicesHandler,
);
