import { executeProcedure, input, sql } from '../../db/executeProcedure.js';
import type { ImportOutstandingQuery } from './customerOutstanding.schema.js';

export interface CustomerOutstandingRow {
  Success: number;
  Action?: string;
  CustomerCode?: string | null;
  TotalOutstandingRecords?: number;
  TotalOutstandingAmount?: number;
  ErrorNumber?: number;
  ErrorMessage?: string;
  ErrorLine?: number;
  ErrorProcedure?: string;
}

const IMPORT_CUSTOMER_OUTSTANDING = 'dbo.USP_IMPORT_SAGE_CUSTOMER_OUTSTANDING';

export async function importCustomerOutstanding(
  filters: ImportOutstandingQuery,
): Promise<CustomerOutstandingRow> {
  const result = await executeProcedure<CustomerOutstandingRow>(IMPORT_CUSTOMER_OUTSTANDING, {
    BPCNUM: input(sql.VarChar(50), filters.customerCode ?? null),
  });

  const row = result.recordset[0];
  if (!row) {
    throw new Error(`${IMPORT_CUSTOMER_OUTSTANDING} did not return a result row`);
  }

  return row;
}
