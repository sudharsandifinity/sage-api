import { Router } from 'express';
import { validate } from '../../middleware/validate.js';
import { exportSalesOrderHandler } from './salesOrders.controller.js';
import { exportSalesOrderParamsSchema } from './salesOrders.schema.js';

export const salesOrdersRouter = Router();

salesOrdersRouter.post(
  '/:soNumber/export',
  validate({ params: exportSalesOrderParamsSchema }),
  exportSalesOrderHandler,
);
