import { Router } from 'express';
import { validate } from '../../middleware/validate.js';
import { pushStockTransfersHandler } from './stockTransfers.controller.js';
import { pushStockTransfersQuerySchema } from './stockTransfers.schema.js';

export const stockTransfersRouter = Router();

stockTransfersRouter.post(
  '/push',
  validate({ query: pushStockTransfersQuerySchema }),
  pushStockTransfersHandler,
);
