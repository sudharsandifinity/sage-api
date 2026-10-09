import type { RequestHandler } from 'express';
import { validatedQuery } from '../../middleware/validate.js';
import type { ImportItemsQuery } from './items.schema.js';
import { importItems } from './items.service.js';

export const importItemsHandler: RequestHandler = async (req, res) => {
  const filters = validatedQuery<ImportItemsQuery>(req);
  const result = await importItems(filters);
  res.status(200).json({ data: result });
};
