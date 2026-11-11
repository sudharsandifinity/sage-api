import { Router } from 'express';
import { validate } from '../../middleware/validate.js';
import {
  exportTransferOrderLoadHandler,
  exportTransferOrderOffloadHandler,
  pushStockTransferLoadHandler,
  pushStockTransferOffloadHandler,
} from './stockTransfers.controller.js';
import { pushStockTransfersQuerySchema } from './stockTransfers.schema.js';

export const stockTransfersRouter = Router();

stockTransfersRouter.post(
  '/load/push',
  validate({ query: pushStockTransfersQuerySchema }),
  pushStockTransferLoadHandler,
);

stockTransfersRouter.post('/load/export', exportTransferOrderLoadHandler);

stockTransfersRouter.post(
  '/offload/push',
  validate({ query: pushStockTransfersQuerySchema }),
  pushStockTransferOffloadHandler,
);

stockTransfersRouter.post('/offload/export', exportTransferOrderOffloadHandler);
