import { Router } from 'express';
import { exportSalesOrderHandler } from './salesOrders.controller.js';

export const salesOrdersRouter = Router();

salesOrdersRouter.post('/export', exportSalesOrderHandler);
