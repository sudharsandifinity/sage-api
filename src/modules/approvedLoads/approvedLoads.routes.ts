import { Router } from 'express';
import { validate } from '../../middleware/validate.js';
import { pushApprovedLoadsHandler } from './approvedLoads.controller.js';
import { pushApprovedLoadsQuerySchema } from './approvedLoads.schema.js';

export const approvedLoadsRouter = Router();

approvedLoadsRouter.post(
  '/push',
  validate({ query: pushApprovedLoadsQuerySchema }),
  pushApprovedLoadsHandler,
);
