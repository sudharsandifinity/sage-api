import type { RequestHandler } from 'express';
import { STATIC_SALES_ORDER_NUMBER, exportSalesOrder } from './salesOrders.service.js';

export const exportSalesOrderHandler: RequestHandler = async (_req, res) => {
  const result = await exportSalesOrder(STATIC_SALES_ORDER_NUMBER);
  res.status(200).json({ data: result });
};
