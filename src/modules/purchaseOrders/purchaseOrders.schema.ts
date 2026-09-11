import { z } from 'zod';

const hasPohSequence = (value: string): boolean => {
  const index = value.indexOf('POH');
  if (index === -1) {
    return false;
  }

  const tail = value.slice(index + 3);
  return tail.length > 0 && /^\d+$/.test(tail);
};

const purchaseOrderNumber = (max: number) =>
  z
    .string()
    .trim()
    .min(4)
    .max(max)
    .transform((value) => value.toUpperCase())
    .refine(
      hasPohSequence,
      'Expected a Sage PO number containing POH followed by a numeric sequence',
    );

export const exportPurchaseOrderParamsSchema = z.object({
  poNumber: purchaseOrderNumber(30),
});

export const asnImportParamsSchema = z.object({
  poNumber: purchaseOrderNumber(50),
});

export type ExportPurchaseOrderParams = z.infer<typeof exportPurchaseOrderParamsSchema>;
export type AsnImportParams = z.infer<typeof asnImportParamsSchema>;
