import type { RequestHandler } from 'express';
import { validatedQuery } from '../../middleware/validate.js';
import type { StockTransferDirection } from './stockTransfers.repository.js';
import type { PushStockTransfersQuery } from './stockTransfers.schema.js';
import { exportTransferOrders, pushStockTransfers } from './stockTransfers.service.js';

const handlerFor = (direction: StockTransferDirection): RequestHandler => async (req, res) => {
  const filters = validatedQuery<PushStockTransfersQuery>(req);
  const result = await pushStockTransfers(direction, filters);
  res.status(200).json({ data: result });
};

export const pushStockTransferLoadHandler = handlerFor('load');

export const pushStockTransferOffloadHandler = handlerFor('offload');

export const exportTransferOrdersHandler: RequestHandler = async (_req, res) => {
  const result = await exportTransferOrders();
  res.status(200).json({ data: result });
};
