import type { RequestHandler } from 'express';
import { validatedQuery } from '../../middleware/validate.js';
import type { StockTransferDirection } from './stockTransfers.repository.js';
import type {
  ConfirmLoadQuery,
  ConfirmOffloadQuery,
  PushStockTransfersQuery,
} from './stockTransfers.schema.js';
import {
  confirmTransferOrders,
  exportTransferOrders,
  pushStockTransfers,
} from './stockTransfers.service.js';

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

export const confirmLoadHandler: RequestHandler = async (req, res) => {
  const { soNumber } = validatedQuery<ConfirmLoadQuery>(req);
  const result = await confirmTransferOrders('load', soNumber ?? null);
  res.status(200).json({ data: result });
};

export const confirmOffloadHandler: RequestHandler = async (req, res) => {
  const { poNumber } = validatedQuery<ConfirmOffloadQuery>(req);
  const result = await confirmTransferOrders('offload', poNumber ?? null);
  res.status(200).json({ data: result });
};
