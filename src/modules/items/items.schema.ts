import { z } from 'zod';

const optionalCode = z.preprocess(
  (value) => (typeof value === 'string' && value.trim() === '' ? undefined : value),
  z.string().trim().min(1).max(50).optional(),
);

export const importItemsQuerySchema = z.object({
  itemCode: optionalCode,
  categoryCode: optionalCode,
});

export type ImportItemsQuery = z.infer<typeof importItemsQuerySchema>;
