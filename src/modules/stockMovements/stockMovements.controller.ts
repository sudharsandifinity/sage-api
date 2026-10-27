import type { RequestHandler } from 'express';
import { validatedQuery } from '../../middleware/validate.js';
import type { ExportStockMovementsQuery } from './stockMovements.schema.js';
import { exportStockMovements } from './stockMovements.service.js';

export const exportStockMovementsHandler: RequestHandler = async (req, res) => {
  const filters = validatedQuery<ExportStockMovementsQuery>(req);
  const result = await exportStockMovements(filters);
  res.status(200).json({ data: result });
};
