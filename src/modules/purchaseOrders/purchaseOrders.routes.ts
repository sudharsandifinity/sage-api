import { Router } from 'express';
import { validate } from '../../middleware/validate.js';
import { asnImportHandler, exportPurchaseOrderHandler } from './purchaseOrders.controller.js';
import {
  asnImportParamsSchema,
  exportPurchaseOrderParamsSchema,
} from './purchaseOrders.schema.js';

export const purchaseOrdersRouter = Router();

purchaseOrdersRouter.post(
  '/:poNumber/export',
  validate({ params: exportPurchaseOrderParamsSchema }),
  exportPurchaseOrderHandler,
);

purchaseOrdersRouter.post(
  '/:poNumber/asn-import',
  validate({ params: asnImportParamsSchema }),
  asnImportHandler,
);
