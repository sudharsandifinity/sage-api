import { AppError } from '../../utils/AppError.js';
import * as repository from './stockMovements.repository.js';
import type {
  StockTransferDetailRow,
  StockTransferHeaderRow,
} from './stockMovements.repository.js';
import type { ExportStockMovementsQuery } from './stockMovements.schema.js';

export interface StockTransferHeader {
  transactionNumber: string;
  warehouseCode: string | null;
  vehicleCode: string | null;
  salesmanCode: string | null;
  transactionType: number | null;
  transactionDate: string | null;
  isProcessed: number | null;
  erpMessage: string | null;
  erpReferenceNo: string | null;
}

export interface StockTransferDetail {
  transactionNumber: string;
  lineNumber: number | null;
  itemCode: string | null;
  itemUom: string | null;
  quantity: number;
  batchNumber: string | null;
  expiryDate: string | null;
}

export interface StockMovementExportResult {
  status: string;
  transactionId: string | null;
  insertedHeaders: number;
  insertedDetails: number;
  pendingHeaderCount: number;
  pendingDetailCount: number;
  message: string;
  headers?: StockTransferHeader[];
  details?: StockTransferDetail[];
}

const toIsoDate = (value: Date | string | null): string | null => {
  if (value === null) {
    return null;
  }
  return value instanceof Date ? value.toISOString() : String(value);
};

const toHeader = (row: StockTransferHeaderRow): StockTransferHeader => ({
  transactionNumber: row.TransactionNumber,
  warehouseCode: row.WarehouseCode,
  vehicleCode: row.VehicleCode,
  salesmanCode: row.SalesmanCode,
  transactionType: row.TransactionType === null ? null : Number(row.TransactionType),
  transactionDate: toIsoDate(row.TransactionDate),
  isProcessed: row.IsProcessed === null ? null : Number(row.IsProcessed),
  erpMessage: row.ERPMessage,
  erpReferenceNo: row.ERPReferenceNo,
});

const toDetail = (row: StockTransferDetailRow): StockTransferDetail => ({
  transactionNumber: row.TransactionNumber,
  lineNumber: row.LineNumber === null ? null : Number(row.LineNumber),
  itemCode: row.ItemCode,
  itemUom: row.ItemUOM,
  quantity: Number(row.Quantity ?? 0),
  batchNumber: row.BatchNumber,
  expiryDate: toIsoDate(row.ExpiryDate),
});

export async function exportStockMovements(
  filters: ExportStockMovementsQuery,
): Promise<StockMovementExportResult> {
  const { summary, headers, details } = await repository.exportStockMovements(filters);
  const status = String(summary.Status ?? '').trim().toUpperCase();

  if (status !== 'SUCCESS') {
    throw new AppError(
      400,
      'STOCK_MOVEMENT_EXPORT_FAILED',
      summary.Message ?? 'Stock movement export failed',
      { transactionId: filters.transactionId ?? null, status },
    );
  }

  const result: StockMovementExportResult = {
    status,
    transactionId: filters.transactionId ?? null,
    insertedHeaders: Number(summary.InsertedHeaders ?? 0),
    insertedDetails: Number(summary.InsertedDetails ?? 0),
    pendingHeaderCount: headers.length,
    pendingDetailCount: details.length,
    message: summary.Message,
  };

  if (filters.includeRows) {
    result.headers = headers.map(toHeader);
    result.details = details.map(toDetail);
  }

  return result;
}
