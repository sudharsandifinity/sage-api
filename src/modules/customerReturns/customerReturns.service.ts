import { AppError } from '../../utils/AppError.js';
import * as repository from './customerReturns.repository.js';

export interface CustomerReturnAsnResult {
  status: number;
  insertedRows: number;
  message: string;
}

export async function importAsn(): Promise<CustomerReturnAsnResult> {
  const row = await repository.importCustomerReturnAsn();
  const status = Number(row.STATUS);
  const insertedRows = Number(row.INSERTED_ROWS ?? 0);
  const message = row.MESSAGE;

  if (status !== 1) {
    throw new AppError(400, 'CUSTOMER_RETURN_ASN_IMPORT_FAILED', message, {
      insertedRows,
      ...(row.ERROR_NUMBER === undefined ? {} : { errorNumber: Number(row.ERROR_NUMBER) }),
      ...(row.ERROR_LINE === undefined ? {} : { errorLine: Number(row.ERROR_LINE) }),
    });
  }

  return { status, insertedRows, message };
}
