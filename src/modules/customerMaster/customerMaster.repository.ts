import { executeProcedure, input, sql } from '../../db/executeProcedure.js';
import type { ImportCustomersQuery } from './customerMaster.schema.js';

export interface CustomerRow {
  OrgCode: string | null;
  BillToCode: string;
  BillToName: string | null;
  BillToName_A: string | null;
  ShipToCode: string;
  ShipToName: string | null;
  ShipToName_A: string | null;
  CustomerType: number | null;
  PaymentTermDays: number | null;
  CreditLimit: number | null;
  InActive: number | null;
  BillToAddress: string | null;
  ShipToAddress: string | null;
  Phone: string | null;
  Mobile: string | null;
  Latitude: number | null;
  Longitude: number | null;
  ChannelCode: string | null;
  ChannelName: string | null;
  SubChannelCode: string | null;
  SubChannelName: string | null;
  GroupCode: string | null;
  GroupName: string | null;
  Taxable: number | null;
  TRNO: string | null;
  TradeLicense: string | null;
  CreatedDate: Date | string | null;
  UpdatedDate: Date | string | null;
  IsProcessed: number | null;
}

export interface CustomerErrorRow {
  ErrorNumber?: number;
  ErrorMessage?: string;
  ErrorLine?: number;
  ErrorProcedure?: string;
}

export interface CustomerImportRaw {
  returnValue: number;
  rows: CustomerRow[];
  error: CustomerErrorRow | null;
}

const IMPORT_SAGE_CUSTOMER = 'dbo.USP_IMPORT_SAGE_CUSTOMER_TO_SONIC';

export async function importSageCustomers(
  filters: ImportCustomersQuery,
): Promise<CustomerImportRaw> {
  const result = await executeProcedure<Record<string, unknown>>(IMPORT_SAGE_CUSTOMER, {
    BillToCode: input(sql.VarChar(50), filters.billToCode ?? null),
  });

  const first = result.recordset[0];
  const isErrorShape = first !== undefined && 'ErrorMessage' in first;

  return {
    returnValue: result.returnValue,
    rows: isErrorShape ? [] : ((result.recordset as unknown) as CustomerRow[]),
    error: isErrorShape ? ((first as unknown) as CustomerErrorRow) : null,
  };
}
