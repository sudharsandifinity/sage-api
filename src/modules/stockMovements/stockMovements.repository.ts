import { executeProcedure, input, sql } from '../../db/executeProcedure.js';
import type { ExportStockMovementsQuery } from './stockMovements.schema.js';

export interface StockMovementSummaryRow {
  Status: string;
  InsertedHeaders: number;
  InsertedDetails: number;
  Message: string;
}

export interface StockTransferHeaderRow {
  TransactionNumber: string;
  WarehouseCode: string | null;
  VehicleCode: string | null;
  SalesmanCode: string | null;
  TransactionType: number | null;
  TransactionDate: Date | string | null;
  IsProcessed: number | null;
  ERPMessage: string | null;
  ERPReferenceNo: string | null;
}

export interface StockTransferDetailRow {
  TransactionNumber: string;
  LineNumber: number | null;
  ItemCode: string | null;
  ItemUOM: string | null;
  Quantity: number | null;
  BatchNumber: string | null;
  ExpiryDate: Date | string | null;
}

export interface StockMovementExportRaw {
  summary: StockMovementSummaryRow;
  headers: StockTransferHeaderRow[];
  details: StockTransferDetailRow[];
}

const EXPORT_STOCK_MOVEMENTS = 'dbo.USP_EXPORT_SAGE_STOCK_MOVEMENTS_TO_SONIC';

export async function exportStockMovements(
  filters: ExportStockMovementsQuery,
): Promise<StockMovementExportRaw> {
  const result = await executeProcedure<Record<string, unknown>>(EXPORT_STOCK_MOVEMENTS, {
    TransactionID: input(sql.NVarChar(50), filters.transactionId ?? null),
  });

  const sets = result.recordsets;
  const summary = sets[0]?.[0] as StockMovementSummaryRow | undefined;

  if (!summary) {
    throw new Error(`${EXPORT_STOCK_MOVEMENTS} did not return a summary row`);
  }

  return {
    summary,
    headers: ((sets[1] ?? []) as unknown) as StockTransferHeaderRow[],
    details: ((sets[2] ?? []) as unknown) as StockTransferDetailRow[],
  };
}
