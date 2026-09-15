import type { RequestHandler } from 'express';
import { importAsn } from './customerReturns.service.js';

export const customerReturnAsnImportHandler: RequestHandler = async (_req, res) => {
  const result = await importAsn();
  res.status(200).json({ data: result });
};
