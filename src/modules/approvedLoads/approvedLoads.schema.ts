import { z } from 'zod';

export const pushApprovedLoadsQuerySchema = z.object({
  transactionId: z.preprocess(
    (value) => (typeof value === 'string' && value.trim() === '' ? undefined : value),
    z.string().trim().min(1).max(50).optional(),
  ),
});

export type PushApprovedLoadsQuery = z.infer<typeof pushApprovedLoadsQuerySchema>;
