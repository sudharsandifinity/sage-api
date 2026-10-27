import * as repository from './payments.repository.js';
import type { PushPaymentsQuery } from './payments.schema.js';

export interface PushPaymentsResult {
  paymentNumber: string | null;
  total: number;
  recordsInserted: number;
  recordsFailed: number;
  result: string;
}

export async function pushPayments(filters: PushPaymentsQuery): Promise<PushPaymentsResult> {
  const row = await repository.pushPayments(filters);
  const recordsInserted = Number(row.RecordsInserted ?? 0);
  const recordsFailed = Number(row.RecordsFailed ?? 0);

  return {
    paymentNumber: filters.paymentNumber ?? null,
    total: recordsInserted + recordsFailed,
    recordsInserted,
    recordsFailed,
    result: row.Result,
  };
}
