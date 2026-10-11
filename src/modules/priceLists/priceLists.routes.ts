import { Router } from 'express';
import { validate } from '../../middleware/validate.js';
import { importPriceListHandler } from './priceLists.controller.js';
import { importPriceListQuerySchema } from './priceLists.schema.js';

export const priceListsRouter = Router();

priceListsRouter.post(
  '/import',
  validate({ query: importPriceListQuerySchema }),
  importPriceListHandler,
);
