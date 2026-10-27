import * as repository from './salesInvoices.repository.js';
import type { PushSalesInvoicesQuery } from './salesInvoices.schema.js';

export interface PushSalesInvoicesResult {
  transactionNumber: string | null;
  total: number;
  successfulInvoices: number;
  failedInvoices: number;
}

export async function pushSalesInvoices(
  filters: PushSalesInvoicesQuery,
): Promise<PushSalesInvoicesResult> {
  const row = await repository.pushSalesInvoices(filters);
  const successfulInvoices = Number(row.SuccessfulInvoices ?? 0);
  const failedInvoices = Number(row.FailedInvoices ?? 0);

  return {
    transactionNumber: filters.transactionNumber ?? null,
    total: successfulInvoices + failedInvoices,
    successfulInvoices,
    failedInvoices,
  };
}
