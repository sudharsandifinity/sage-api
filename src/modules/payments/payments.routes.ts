import { Router } from 'express';
import { validate } from '../../middleware/validate.js';
import { pushPaymentsHandler } from './payments.controller.js';
import { pushPaymentsQuerySchema } from './payments.schema.js';

export const paymentsRouter = Router();

paymentsRouter.post('/push', validate({ query: pushPaymentsQuerySchema }), pushPaymentsHandler);
