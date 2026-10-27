import type { RequestHandler } from 'express';
import { validatedParams, validatedQuery } from '../../middleware/validate.js';
import type {
  ExportSalesOrderParams,
  PickConfirmationParams,
  PushSalesOrdersQuery,
} from './salesOrders.schema.js';
import { confirmPick, exportSalesOrder, pushSalesOrders } from './salesOrders.service.js';

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

export const pushSalesOrdersHandler: RequestHandler = async (req, res) => {
  const filters = validatedQuery<PushSalesOrdersQuery>(req);
  const result = await pushSalesOrders(filters);
  res.status(200).json({ data: result });
};
