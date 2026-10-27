import { z } from 'zod';

export const pushPaymentsQuerySchema = z.object({
  paymentNumber: z.preprocess(
    (value) => (typeof value === 'string' && value.trim() === '' ? undefined : value),
    z.string().trim().min(1).max(50).optional(),
  ),
});

export type PushPaymentsQuery = z.infer<typeof pushPaymentsQuerySchema>;
