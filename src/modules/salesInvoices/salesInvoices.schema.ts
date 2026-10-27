import { z } from 'zod';

export const pushSalesInvoicesQuerySchema = z.object({
  transactionNumber: z.preprocess(
    (value) => (typeof value === 'string' && value.trim() === '' ? undefined : value),
    z.string().trim().min(1).max(50).optional(),
  ),
});

export type PushSalesInvoicesQuery = z.infer<typeof pushSalesInvoicesQuerySchema>;
