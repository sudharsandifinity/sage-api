import type { RequestHandler } from 'express';
import { validatedQuery } from '../../middleware/validate.js';
import type { ImportCustomersQuery } from './customerMaster.schema.js';
import { importCustomers } from './customerMaster.service.js';

export const importCustomersHandler: RequestHandler = async (req, res) => {
  const filters = validatedQuery<ImportCustomersQuery>(req);
  const result = await importCustomers(filters);
  res.status(200).json({ data: result });
};
