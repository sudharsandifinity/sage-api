import { z } from 'zod';

export const importPriceListQuerySchema = z.object({
  priceListCode: z.preprocess(
    (value) => (typeof value === 'string' && value.trim() === '' ? undefined : value),
    z.string().trim().min(1).max(50).optional(),
  ),
});

export type ImportPriceListQuery = z.infer<typeof importPriceListQuerySchema>;
