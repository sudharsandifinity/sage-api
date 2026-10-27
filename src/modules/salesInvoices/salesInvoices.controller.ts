import type { RequestHandler } from 'express';
import { validatedQuery } from '../../middleware/validate.js';
import type { PushSalesInvoicesQuery } from './salesInvoices.schema.js';
import { pushSalesInvoices } from './salesInvoices.service.js';

export const pushSalesInvoicesHandler: RequestHandler = async (req, res) => {
  const filters = validatedQuery<PushSalesInvoicesQuery>(req);
  const result = await pushSalesInvoices(filters);
  res.status(200).json({ data: result });
};
