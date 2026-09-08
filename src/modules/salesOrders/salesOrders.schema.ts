import { z } from 'zod';

export const exportSalesOrderParamsSchema = z.object({
  soNumber: z
    .string()
    .trim()
    .min(3)
    .max(30)
    .regex(/^SO\d+$/i, 'Expected format is SO followed by a numeric value')
    .transform((value) => value.toUpperCase()),
});

export type ExportSalesOrderParams = z.infer<typeof exportSalesOrderParamsSchema>;
