import type { RequestHandler } from 'express';
import { validatedQuery } from '../../middleware/validate.js';
import type { PushStockTransfersQuery } from './stockTransfers.schema.js';
import { pushStockTransfers } from './stockTransfers.service.js';

export const pushStockTransfersHandler: RequestHandler = async (req, res) => {
  const filters = validatedQuery<PushStockTransfersQuery>(req);
  const result = await pushStockTransfers(filters);
  res.status(200).json({ data: result });
};
