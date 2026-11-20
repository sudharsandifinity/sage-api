import type { RequestHandler } from 'express';
import { validatedQuery } from '../../middleware/validate.js';
import type {
  ExportApprovedLoadsQuery,
  PushApprovedLoadsQuery,
} from './approvedLoads.schema.js';
import { exportApprovedLoads, pushApprovedLoads } from './approvedLoads.service.js';

export const pushApprovedLoadsHandler: RequestHandler = async (req, res) => {
  const filters = validatedQuery<PushApprovedLoadsQuery>(req);
  const result = await pushApprovedLoads(filters);
  res.status(200).json({ data: result });
};

export const exportApprovedLoadsHandler: RequestHandler = async (req, res) => {
  const filters = validatedQuery<ExportApprovedLoadsQuery>(req);
  const result = await exportApprovedLoads(filters);
  res.status(200).json({ data: result });
};
