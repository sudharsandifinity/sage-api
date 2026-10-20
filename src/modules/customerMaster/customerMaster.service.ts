import { AppError } from '../../utils/AppError.js';
import * as repository from './customerMaster.repository.js';
import type { CustomerRow } from './customerMaster.repository.js';
import type { ImportCustomersQuery } from './customerMaster.schema.js';

export interface Customer {
  orgCode: string | null;
  billToCode: string;
  billToName: string | null;
  billToNameA: string | null;
  shipToCode: string;
  shipToName: string | null;
  shipToNameA: string | null;
  customerType: number | null;
  paymentTermDays: number;
  creditLimit: number;
  inActive: number | null;
  billToAddress: string | null;
  shipToAddress: string | null;
  phone: string | null;
  mobile: string | null;
  latitude: number;
  longitude: number;
  channelCode: string | null;
  channelName: string | null;
  subChannelCode: string | null;
  subChannelName: string | null;
  groupCode: string | null;
  groupName: string | null;
  taxable: number | null;
  trno: string | null;
  tradeLicense: string | null;
  createdDate: string | null;
  updatedDate: string | null;
  isProcessed: number | null;
}

export interface CustomerImportResult {
  status: string;
  billToCode: string | null;
  customerCount: number;
  customers?: Customer[];
}

const toIsoDate = (value: Date | string | null): string | null => {
  if (value === null) {
    return null;
  }
  return value instanceof Date ? value.toISOString() : String(value);
};

const toCustomer = (row: CustomerRow): Customer => ({
  orgCode: row.OrgCode,
  billToCode: row.BillToCode,
  billToName: row.BillToName,
  billToNameA: row.BillToName_A,
  shipToCode: row.ShipToCode,
  shipToName: row.ShipToName,
  shipToNameA: row.ShipToName_A,
  customerType: row.CustomerType === null ? null : Number(row.CustomerType),
  paymentTermDays: Number(row.PaymentTermDays ?? 0),
  creditLimit: Number(row.CreditLimit ?? 0),
  inActive: row.InActive === null ? null : Number(row.InActive),
  billToAddress: row.BillToAddress,
  shipToAddress: row.ShipToAddress,
  phone: row.Phone,
  mobile: row.Mobile,
  latitude: Number(row.Latitude ?? 0),
  longitude: Number(row.Longitude ?? 0),
  channelCode: row.ChannelCode,
  channelName: row.ChannelName,
  subChannelCode: row.SubChannelCode,
  subChannelName: row.SubChannelName,
  groupCode: row.GroupCode,
  groupName: row.GroupName,
  taxable: row.Taxable === null ? null : Number(row.Taxable),
  trno: row.TRNO,
  tradeLicense: row.TradeLicense,
  createdDate: toIsoDate(row.CreatedDate),
  updatedDate: toIsoDate(row.UpdatedDate),
  isProcessed: row.IsProcessed === null ? null : Number(row.IsProcessed),
});

export async function importCustomers(
  filters: ImportCustomersQuery,
): Promise<CustomerImportResult> {
  const { returnValue, rows, error } = await repository.importSageCustomers(filters);

  if (returnValue === -1 || error !== null) {
    throw new AppError(
      400,
      'CUSTOMER_IMPORT_FAILED',
      error?.ErrorMessage ?? 'Customer import failed',
      {
        billToCode: filters.billToCode ?? null,
        ...(error?.ErrorNumber === undefined ? {} : { errorNumber: Number(error.ErrorNumber) }),
        ...(error?.ErrorLine === undefined ? {} : { errorLine: Number(error.ErrorLine) }),
      },
    );
  }

  const result: CustomerImportResult = {
    status: 'SUCCESS',
    billToCode: filters.billToCode ?? null,
    customerCount: rows.length,
  };

  if (filters.includeRows) {
    result.customers = rows.map(toCustomer);
  }

  return result;
}
