import type { RequestHandler } from 'express';
import { validatedParams } from '../../middleware/validate.js';
import type { ExportSalesOrderParams } from './salesOrders.schema.js';
import { exportSalesOrder } from './salesOrders.service.js';

export const exportSalesOrderHandler: RequestHandler = async (req, res) => {
  const { soNumber } = validatedParams<ExportSalesOrderParams>(req);
  const result = await exportSalesOrder(soNumber);
  res.status(200).json({ data: result });
};
