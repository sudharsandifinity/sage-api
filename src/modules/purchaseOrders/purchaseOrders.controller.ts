import type { RequestHandler } from 'express';
import { validatedParams } from '../../middleware/validate.js';
import type { AsnImportParams, ExportPurchaseOrderParams } from './purchaseOrders.schema.js';
import { exportPurchaseOrder, importAsn } from './purchaseOrders.service.js';

export const exportPurchaseOrderHandler: RequestHandler = async (req, res) => {
  const { poNumber } = validatedParams<ExportPurchaseOrderParams>(req);
  const result = await exportPurchaseOrder(poNumber);
  res.status(200).json({ data: result });
};

export const asnImportHandler: RequestHandler = async (req, res) => {
  const { poNumber } = validatedParams<AsnImportParams>(req);
  const result = await importAsn(poNumber);
  res.status(200).json({ data: result });
};
