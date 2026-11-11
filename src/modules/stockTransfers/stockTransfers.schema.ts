import { z } from 'zod';

export const pushStockTransfersQuerySchema = z.object({
  transactionNumber: z.preprocess(
    (value) => (typeof value === 'string' && value.trim() === '' ? undefined : value),
    z.string().trim().min(1).max(50).optional(),
  ),
});

export type PushStockTransfersQuery = z.infer<typeof pushStockTransfersQuerySchema>;
