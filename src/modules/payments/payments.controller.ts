import type { RequestHandler } from 'express';
import { validatedQuery } from '../../middleware/validate.js';
import type { PushPaymentsQuery } from './payments.schema.js';
import { pushPayments } from './payments.service.js';

export const pushPaymentsHandler: RequestHandler = async (req, res) => {
  const filters = validatedQuery<PushPaymentsQuery>(req);
  const result = await pushPayments(filters);
  res.status(200).json({ data: result });
};
