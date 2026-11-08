import type { RequestHandler } from 'express';
import { validatedQuery } from '../../middleware/validate.js';
import type { PushApprovedLoadsQuery } from './approvedLoads.schema.js';
import { pushApprovedLoads } from './approvedLoads.service.js';

export const pushApprovedLoadsHandler: RequestHandler = async (req, res) => {
  const filters = validatedQuery<PushApprovedLoadsQuery>(req);
  const result = await pushApprovedLoads(filters);
  res.status(200).json({ data: result });
};
