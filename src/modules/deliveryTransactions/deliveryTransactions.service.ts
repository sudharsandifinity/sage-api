import { AppError } from '../../utils/AppError.js';
import * as repository from './deliveryTransactions.repository.js';
import type {
  DeliveryDetailRow,
  DeliveryHeaderRow,
} from './deliveryTransactions.repository.js';
import type { ExportDeliveryTransactionsQuery } from './deliveryTransactions.schema.js';

export interface DeliveryHeader {
  orgCode: string | null;
  billToCode: string | null;
  shipToCode: string | null;
  transactionNumber: string;
  refNo: string | null;
  transactionType: number;
  grossAmount: number;
  totalAmount: number;
  taxAmount: number;
  salesmanCode: string | null;
  invoiceDate: string | null;
}

export interface DeliveryDetail {
  transactionNumber: string;
  refNo: string | null;
  itemCode: string | null;
  unitPrice: number;
  qty: number;
  discount: number;
  tax: number;
  grossAmount: number;
}

export interface DeliveryExportResult {
  status: string;
  invoiceNumber: string | null;
  headerCount: number;
  detailCount: number;
  headers?: DeliveryHeader[];
  details?: DeliveryDetail[];
}

const toIsoDate = (value: Date | string | null): string | null => {
  if (value === null) {
    return null;
  }
  return value instanceof Date ? value.toISOString() : String(value);
};

const toHeader = (row: DeliveryHeaderRow): DeliveryHeader => ({
  orgCode: row.OrgCode,
  billToCode: row.BillToCode,
  shipToCode: row.ShipToCode,
  transactionNumber: row.TransactionNumber,
  refNo: row.REF_NO,
  transactionType: Number(row.TransactionType),
  grossAmount: Number(row.GrossAmount ?? 0),
  totalAmount: Number(row.TotalAmount ?? 0),
  taxAmount: Number(row.TaxAmount ?? 0),
  salesmanCode: row.SalesmanCode,
  invoiceDate: toIsoDate(row.InvoiceDate),
});

const toDetail = (row: DeliveryDetailRow): DeliveryDetail => ({
  transactionNumber: row.TransactionNumber,
  refNo: row.REF_NO,
  itemCode: row.ItemCode,
  unitPrice: Number(row.UnitPrice ?? 0),
  qty: Number(row.QTY ?? 0),
  discount: Number(row.Discount ?? 0),
  tax: Number(row.Tax ?? 0),
  grossAmount: Number(row.GrossAmount ?? 0),
});

export async function exportDeliveryTransactions(
  filters: ExportDeliveryTransactionsQuery,
): Promise<DeliveryExportResult> {
  const { summary, headers, details } = await repository.exportDeliveryTransactions(filters);
  const status = String(summary.Status ?? '').trim().toUpperCase();

  if (status !== 'SUCCESS') {
    throw new AppError(400, 'DELIVERY_TRANSACTIONS_EXPORT_FAILED', 'Delivery transaction export failed', {
      invoiceNumber: filters.invoiceNumber ?? null,
      status,
    });
  }

  const result: DeliveryExportResult = {
    status,
    invoiceNumber: filters.invoiceNumber ?? null,
    headerCount: Number(summary.HeaderCount ?? 0),
    detailCount: Number(summary.DetailCount ?? 0),
  };

  if (filters.includeRows) {
    result.headers = headers.map(toHeader);
    result.details = details.map(toDetail);
  }

  return result;
}
