import type { RequestHandler } from 'express';
import { validatedParams } from '../../middleware/validate.js';
import type { ExportSalesOrderParams, PickConfirmationParams } from './salesOrders.schema.js';
import { confirmPick, exportSalesOrder } from './salesOrders.service.js';

export const exportSalesOrderHandler: RequestHandler = async (req, res) => {
  const { soNumber } = validatedParams<ExportSalesOrderParams>(req);
  const result = await exportSalesOrder(soNumber);
  res.status(200).json({ data: result });
};

export const pickConfirmationHandler: RequestHandler = async (req, res) => {
  const { soNumber } = validatedParams<PickConfirmationParams>(req);
  const result = await confirmPick(soNumber);
  res.status(200).json({ data: result });
};
