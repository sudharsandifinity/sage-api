import { Router } from 'express';
import { validate } from '../../middleware/validate.js';
import { exportDeliveryTransactionsHandler } from './deliveryTransactions.controller.js';
import { exportDeliveryTransactionsQuerySchema } from './deliveryTransactions.schema.js';

export const deliveryTransactionsRouter = Router();

deliveryTransactionsRouter.post(
  '/export',
  validate({ query: exportDeliveryTransactionsQuerySchema }),
  exportDeliveryTransactionsHandler,
);
