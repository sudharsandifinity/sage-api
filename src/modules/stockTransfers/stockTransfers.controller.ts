import type { RequestHandler } from 'express';
import { validatedQuery } from '../../middleware/validate.js';
import type { StockTransferDirection } from './stockTransfers.repository.js';
import type { PushStockTransfersQuery } from './stockTransfers.schema.js';
import { exportTransferOrders, pushStockTransfers } from './stockTransfers.service.js';

const pushHandlerFor = (direction: StockTransferDirection): RequestHandler => async (req, res) => {
  const filters = validatedQuery<PushStockTransfersQuery>(req);
  const result = await pushStockTransfers(direction, filters);
  res.status(200).json({ data: result });
};

const exportHandlerFor = (direction: StockTransferDirection): RequestHandler => async (_req, res) => {
  const result = await exportTransferOrders(direction);
  res.status(200).json({ data: result });
};

export const pushStockTransferLoadHandler = pushHandlerFor('load');

export const pushStockTransferOffloadHandler = pushHandlerFor('offload');

export const exportTransferOrderLoadHandler = exportHandlerFor('load');

export const exportTransferOrderOffloadHandler = exportHandlerFor('offload');
