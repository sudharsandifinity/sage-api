import { Router } from 'express';
import { exportWarehouseStockHandler } from './warehouseStock.controller.js';

export const warehouseStockRouter = Router();

warehouseStockRouter.post('/export', exportWarehouseStockHandler);
