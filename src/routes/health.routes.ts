import { Router } from 'express';
import { pingDatabase } from '../db/pool.js';
import { AppError } from '../utils/AppError.js';

export const healthRouter = Router();

healthRouter.get('/live', (_req, res) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

healthRouter.get('/ready', async (_req, res) => {
  try {
    await pingDatabase();
  } catch (error) {
    throw AppError.serviceUnavailable('Database connection is not available', {
      reason: error instanceof Error ? error.message : 'unknown',
    });
  }

  res.status(200).json({ status: 'ok', database: 'up' });
});
