import { AppError } from '../../utils/AppError.js';
import * as repository from './customerOutstanding.repository.js';
import type { ImportOutstandingQuery } from './customerOutstanding.schema.js';

export interface CustomerOutstandingResult {
  success: boolean;
  action: string;
  customerCode: string | null;
  totalOutstandingRecords: number;
  totalOutstandingAmount: number;
}

export async function importOutstanding(
  filters: ImportOutstandingQuery,
): Promise<CustomerOutstandingResult> {
  const row = await repository.importCustomerOutstanding(filters);

  if (Number(row.Success) !== 1) {
    throw new AppError(
      400,
      'CUSTOMER_OUTSTANDING_IMPORT_FAILED',
      row.ErrorMessage ?? 'Customer outstanding import failed',
      {
        customerCode: filters.customerCode ?? null,
        ...(row.ErrorNumber === undefined ? {} : { errorNumber: Number(row.ErrorNumber) }),
        ...(row.ErrorLine === undefined ? {} : { errorLine: Number(row.ErrorLine) }),
      },
    );
  }

  return {
    success: true,
    action: row.Action ?? 'COMPLETED',
    customerCode: row.CustomerCode ?? filters.customerCode ?? null,
    totalOutstandingRecords: Number(row.TotalOutstandingRecords ?? 0),
    totalOutstandingAmount: Number(row.TotalOutstandingAmount ?? 0),
  };
}
