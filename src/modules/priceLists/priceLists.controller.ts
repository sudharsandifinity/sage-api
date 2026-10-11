import type { RequestHandler } from 'express';
import { validatedQuery } from '../../middleware/validate.js';
import type { ImportPriceListQuery } from './priceLists.schema.js';
import { importPriceList } from './priceLists.service.js';

export const importPriceListHandler: RequestHandler = async (req, res) => {
  const filters = validatedQuery<ImportPriceListQuery>(req);
  const result = await importPriceList(filters);
  res.status(200).json({ data: result });
};
