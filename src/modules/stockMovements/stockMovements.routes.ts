import { Router } from 'express';
import { validate } from '../../middleware/validate.js';
import { exportStockMovementsHandler } from './stockMovements.controller.js';
import { exportStockMovementsQuerySchema } from './stockMovements.schema.js';

export const stockMovementsRouter = Router();

stockMovementsRouter.post(
  '/export',
  validate({ query: exportStockMovementsQuerySchema }),
  exportStockMovementsHandler,
);
