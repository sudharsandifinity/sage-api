import type { RequestHandler } from 'express';
import { exportWarehouseStock } from './warehouseStock.service.js';

export const exportWarehouseStockHandler: RequestHandler = async (_req, res) => {
  const result = await exportWarehouseStock();
  res.status(200).json({ data: result });
};
