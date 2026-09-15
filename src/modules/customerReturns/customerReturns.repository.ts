import { executeProcedure } from '../../db/executeProcedure.js';

export interface CustomerReturnAsnRow {
  STATUS: number;
  INSERTED_ROWS: number;
  MESSAGE: string;
  ERROR_NUMBER?: number;
  ERROR_LINE?: number;
}

const IMPORT_CUSTOMER_RETURN_ASN = 'dbo.USP_IMPORT_CUSTOMER_RETURN_ASN_TO_X3';

export async function importCustomerReturnAsn(): Promise<CustomerReturnAsnRow> {
  const result = await executeProcedure<CustomerReturnAsnRow>(IMPORT_CUSTOMER_RETURN_ASN);

  const row = result.recordset[0];
  if (!row) {
    throw new Error(`${IMPORT_CUSTOMER_RETURN_ASN} did not return a status row`);
  }

  return row;
}
