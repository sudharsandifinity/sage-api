import { executeProcedure, input, sql } from '../../db/executeProcedure.js';
import type { PushSalesInvoicesQuery } from './salesInvoices.schema.js';

export interface SalesInvoiceIntegrationRow {
  SuccessfulInvoices: number;
  FailedInvoices: number;
}

const SALES_INVOICE_INTEGRATION = 'dbo.USPSalesInvoiceIntegration';

export async function pushSalesInvoices(
  filters: PushSalesInvoicesQuery,
): Promise<SalesInvoiceIntegrationRow> {
  const result = await executeProcedure<SalesInvoiceIntegrationRow>(SALES_INVOICE_INTEGRATION, {
    TransactionNumber: input(sql.NVarChar(50), filters.transactionNumber ?? null),
  });

  const row = result.recordset[0];
  if (!row) {
    throw new Error(`${SALES_INVOICE_INTEGRATION} did not return a summary row`);
  }

  return row;
}
