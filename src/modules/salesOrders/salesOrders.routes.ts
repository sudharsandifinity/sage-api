import { Router } from 'express';
import { validate } from '../../middleware/validate.js';
import {
  exportSalesOrderHandler,
  pickConfirmationHandler,
  pushSalesOrdersHandler,
} from './salesOrders.controller.js';
import {
  exportSalesOrderParamsSchema,
  pickConfirmationParamsSchema,
  pushSalesOrdersQuerySchema,
} from './salesOrders.schema.js';

export const salesOrdersRouter = Router();

salesOrdersRouter.post(
  '/push',
  validate({ query: pushSalesOrdersQuerySchema }),
  pushSalesOrdersHandler,
);

salesOrdersRouter.post(
  '/:soNumber/export',
  validate({ params: exportSalesOrderParamsSchema }),
  exportSalesOrderHandler,
);

salesOrdersRouter.post(
  '/:soNumber/pick-confirmation',
  validate({ params: pickConfirmationParamsSchema }),
  pickConfirmationHandler,
);
