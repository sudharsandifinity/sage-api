import type { RequestHandler } from 'express';
import { validatedQuery } from '../../middleware/validate.js';
import type { ImportOutstandingQuery } from './customerOutstanding.schema.js';
import { importOutstanding } from './customerOutstanding.service.js';

export const importOutstandingHandler: RequestHandler = async (req, res) => {
  const filters = validatedQuery<ImportOutstandingQuery>(req);
  const result = await importOutstanding(filters);
  res.status(200).json({ data: result });
};
