import type { RequestHandler } from 'express';
import { validatedQuery } from '../../middleware/validate.js';
import type { ExportDeliveryTransactionsQuery } from './deliveryTransactions.schema.js';
import { exportDeliveryTransactions } from './deliveryTransactions.service.js';

export const exportDeliveryTransactionsHandler: RequestHandler = async (req, res) => {
  const filters = validatedQuery<ExportDeliveryTransactionsQuery>(req);
  const result = await exportDeliveryTransactions(filters);
  res.status(200).json({ data: result });
};
