import { z } from 'zod';

const documentNumber = (max: number) =>
  z
    .string()
    .trim()
    .min(1)
    .max(max)
    .regex(/^[A-Za-z0-9._-]+$/, 'Only letters, digits and . _ - are allowed')
    .transform((value) => value.toUpperCase());

export const exportPurchaseOrderParamsSchema = z.object({
  poNumber: documentNumber(30),
});

export const asnImportParamsSchema = z.object({
  poNumber: documentNumber(50),
});

export type ExportPurchaseOrderParams = z.infer<typeof exportPurchaseOrderParamsSchema>;
export type AsnImportParams = z.infer<typeof asnImportParamsSchema>;
