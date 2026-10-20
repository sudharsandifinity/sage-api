import { executeProcedure, input, sql } from '../../db/executeProcedure.js';
import type { ExportDeliveryTransactionsQuery } from './deliveryTransactions.schema.js';

export interface DeliverySummaryRow {
  Status: string;
  HeaderCount: number;
  DetailCount: number;
}

export interface DeliveryHeaderRow {
  OrgCode: string | null;
  BillToCode: string | null;
  ShipToCode: string | null;
  TransactionNumber: string;
  REF_NO: string | null;
  TransactionType: number;
  GrossAmount: number | null;
  TotalAmount: number | null;
  TaxAmount: number | null;
  SalesmanCode: string | null;
  InvoiceDate: Date | string | null;
}

export interface DeliveryDetailRow {
  TransactionNumber: string;
  REF_NO: string | null;
  ItemCode: string | null;
  UnitPrice: number | null;
  QTY: number | null;
  Discount: number | null;
  Tax: number | null;
  GrossAmount: number | null;
}

export interface DeliveryExportRaw {
  summary: DeliverySummaryRow;
  headers: DeliveryHeaderRow[];
  details: DeliveryDetailRow[];
}

const EXPORT_DELIVERY_TRANSACTIONS = 'dbo.USP_EXPORT_DELIVERY_TRANSACTIONS_TO_SONIC';

export async function exportDeliveryTransactions(
  filters: ExportDeliveryTransactionsQuery,
): Promise<DeliveryExportRaw> {
  const result = await executeProcedure<Record<string, unknown>>(EXPORT_DELIVERY_TRANSACTIONS, {
    InvoiceNumber: input(sql.NVarChar(50), filters.invoiceNumber ?? null),
  });

  const sets = result.recordsets;
  const summary = sets[0]?.[0] as DeliverySummaryRow | undefined;

  if (!summary) {
    throw new Error(`${EXPORT_DELIVERY_TRANSACTIONS} did not return a summary row`);
  }

  return {
    summary,
    headers: ((sets[1] ?? []) as unknown) as DeliveryHeaderRow[],
    details: ((sets[2] ?? []) as unknown) as DeliveryDetailRow[],
  };
}
