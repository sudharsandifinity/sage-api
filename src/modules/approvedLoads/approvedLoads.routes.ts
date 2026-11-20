import { Router } from 'express';
import { validate } from '../../middleware/validate.js';
import {
  exportApprovedLoadsHandler,
  pushApprovedLoadsHandler,
} from './approvedLoads.controller.js';
import {
  exportApprovedLoadsQuerySchema,
  pushApprovedLoadsQuerySchema,
} from './approvedLoads.schema.js';

export const approvedLoadsRouter = Router();

approvedLoadsRouter.post(
  '/push',
  validate({ query: pushApprovedLoadsQuerySchema }),
  pushApprovedLoadsHandler,
);

approvedLoadsRouter.post(
  '/export',
  validate({ query: exportApprovedLoadsQuerySchema }),
  exportApprovedLoadsHandler,
);
