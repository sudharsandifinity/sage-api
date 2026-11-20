import { Router } from 'express';
import { validate } from '../../middleware/validate.js';
import {
  confirmLoadHandler,
  confirmOffloadHandler,
  exportTransferOrderLoadHandler,
  exportTransferOrderOffloadHandler,
  pushStockTransferLoadHandler,
  pushStockTransferOffloadHandler,
} from './stockTransfers.controller.js';
import {
  confirmLoadQuerySchema,
  confirmOffloadQuerySchema,
  pushStockTransfersQuerySchema,
} from './stockTransfers.schema.js';

export const stockTransfersRouter = Router();

stockTransfersRouter.post(
  '/load/push',
  validate({ query: pushStockTransfersQuerySchema }),
  pushStockTransferLoadHandler,
);

stockTransfersRouter.post('/load/export', exportTransferOrderLoadHandler);

stockTransfersRouter.post(
  '/load/confirm',
  validate({ query: confirmLoadQuerySchema }),
  confirmLoadHandler,
);

stockTransfersRouter.post(
  '/offload/push',
  validate({ query: pushStockTransfersQuerySchema }),
  pushStockTransferOffloadHandler,
);

stockTransfersRouter.post('/offload/export', exportTransferOrderOffloadHandler);

stockTransfersRouter.post(
  '/offload/confirm',
  validate({ query: confirmOffloadQuerySchema }),
  confirmOffloadHandler,
);
