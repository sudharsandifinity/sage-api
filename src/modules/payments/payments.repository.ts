import { executeProcedure, input, sql } from '../../db/executeProcedure.js';
import type { PushPaymentsQuery } from './payments.schema.js';

export interface PaymentIntegrationRow {
  RecordsInserted: number;
  RecordsFailed: number;
  Result: string;
}

const PAYMENT_INTEGRATION = 'dbo.USP_Payment_Integration';

export async function pushPayments(
  filters: PushPaymentsQuery,
): Promise<PaymentIntegrationRow> {
  const result = await executeProcedure<PaymentIntegrationRow>(PAYMENT_INTEGRATION, {
    PaymentNumber: input(sql.VarChar(50), filters.paymentNumber ?? null),
  });

  const row = result.recordset[0];
  if (!row) {
    throw new Error(`${PAYMENT_INTEGRATION} did not return a summary row`);
  }

  return row;
}
