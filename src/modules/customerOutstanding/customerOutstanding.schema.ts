import { z } from 'zod';

export const importOutstandingQuerySchema = z.object({
  customerCode: z.preprocess(
    (value) => (typeof value === 'string' && value.trim() === '' ? undefined : value),
    z.string().trim().min(1).max(50).optional(),
  ),
});

export type ImportOutstandingQuery = z.infer<typeof importOutstandingQuerySchema>;
