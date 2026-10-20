import { z } from 'zod';

const TRUTHY = new Set(['true', '1', 'yes']);

export const importCustomersQuerySchema = z.object({
  billToCode: z.preprocess(
    (value) => (typeof value === 'string' && value.trim() === '' ? undefined : value),
    z.string().trim().min(1).max(50).optional(),
  ),
  includeRows: z.preprocess(
    (value) => (typeof value === 'string' ? TRUTHY.has(value.trim().toLowerCase()) : value),
    z.boolean().optional().default(false),
  ),
});

export type ImportCustomersQuery = z.infer<typeof importCustomersQuerySchema>;
