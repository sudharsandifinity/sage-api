import type { RequestHandler } from 'express';
import { validatedQuery } from '../../middleware/validate.js';
import type { ListCustomersQuery } from './customers.schema.js';
import { getCustomers } from './customers.service.js';

export const listCustomersHandler: RequestHandler = async (req, res) => {
  const query = validatedQuery<ListCustomersQuery>(req);
  const result = await getCustomers(query);
  res.status(200).json(result);
};
