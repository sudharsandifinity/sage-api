import { Router } from 'express';
import { validate } from '../../middleware/validate.js';
import { importItemsHandler } from './items.controller.js';
import { importItemsQuerySchema } from './items.schema.js';

export const itemsRouter = Router();

itemsRouter.post('/import', validate({ query: importItemsQuerySchema }), importItemsHandler);
