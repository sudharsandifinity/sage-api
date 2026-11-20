import { z } from 'zod';

const optionalDocumentNumber = z.preprocess(
  (value) => (typeof value === 'string' && value.trim() === '' ? undefined : value),
  z
    .string()
    .trim()
    .min(1)
    .max(50)
    .regex(/^[A-Za-z0-9._-]+$/, 'Only letters, digits and . _ - are allowed')
    .transform((value) => value.toUpperCase())
    .optional(),
);

export const pushStockTransfersQuerySchema = z.object({
  transactionNumber: z.preprocess(
    (value) => (typeof value === 'string' && value.trim() === '' ? undefined : value),
    z.string().trim().min(1).max(50).optional(),
  ),
});

export const confirmLoadQuerySchema = z.object({
  soNumber: optionalDocumentNumber,
});

export const confirmOffloadQuerySchema = z.object({
  poNumber: optionalDocumentNumber,
});

export type PushStockTransfersQuery = z.infer<typeof pushStockTransfersQuerySchema>;
export type ConfirmLoadQuery = z.infer<typeof confirmLoadQuerySchema>;
export type ConfirmOffloadQuery = z.infer<typeof confirmOffloadQuerySchema>;
