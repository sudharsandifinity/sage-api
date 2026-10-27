import { z } from 'zod';

const salesOrderNumber = (max: number) =>
  z
    .string()
    .trim()
    .min(3)
    .max(max)
    .regex(/^SO\d+$/i, 'Expected format is SO followed by a numeric value')
    .transform((value) => value.toUpperCase());

export const exportSalesOrderParamsSchema = z.object({
  soNumber: salesOrderNumber(30),
});

export const pickConfirmationParamsSchema = z.object({
  soNumber: salesOrderNumber(20),
});

export type ExportSalesOrderParams = z.infer<typeof exportSalesOrderParamsSchema>;
export type PickConfirmationParams = z.infer<typeof pickConfirmationParamsSchema>;

export const pushSalesOrdersQuerySchema = z.object({
  orderNumber: z.preprocess(
    (value) => (typeof value === 'string' && value.trim() === '' ? undefined : value),
    z.string().trim().min(1).max(50).optional(),
  ),
});

export type PushSalesOrdersQuery = z.infer<typeof pushSalesOrdersQuerySchema>;
