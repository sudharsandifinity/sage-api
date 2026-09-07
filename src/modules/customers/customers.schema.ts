import { z } from 'zod';

export const listCustomersQuerySchema = z.object({
  search: z.string().trim().min(1).max(100).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(200).default(50),
});

export type ListCustomersQuery = z.infer<typeof listCustomersQuerySchema>;
