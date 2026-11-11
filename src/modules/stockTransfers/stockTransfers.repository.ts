import { executeProcedure, input, sql } from '../../db/executeProcedure.js';
import type { PushStockTransfersQuery } from './stockTransfers.schema.js';

export interface StockTransferResultRow {
  TransactionNumber: string;
  SequenceNumber: string | null;
  ERPMessage: string | null;
}

export interface TransferOrderExportRow {
  TotalSageDetailLines?: number | null;
  TotalWMSLines?: number | null;
  ProcessedHeaders?: number | null;
  Result?: string | null;
  ErrorNumber?: number | null;
  ErrorMessage?: string | null;
  ErrorLine?: number | null;
}

export type StockTransferDirection = 'load' | 'offload';

const PUSH_PROCEDURES: Record<StockTransferDirection, string> = {
  load: 'dbo.USP_EXPORT_SAGE_STOCK_TRANSFER_LOAD',
  offload: 'dbo.USP_EXPORT_SAGE_STOCK_TRANSFER_OFFLOAD',
};

const EXPORT_PROCEDURES: Record<StockTransferDirection, string> = {
  load: 'dbo.USP_EXPORT_SAGE_TRANSFER_ORDERS_TO_WMS',
  offload: 'dbo.USP_EXPORT_SAGE_TRANSFER_ORDERS_TO_WMS_PO',
};

export async function pushStockTransfers(
  direction: StockTransferDirection,
  filters: PushStockTransfersQuery,
): Promise<StockTransferResultRow[]> {
  const result = await executeProcedure<StockTransferResultRow>(PUSH_PROCEDURES[direction], {
    TransactionNumber: input(sql.NVarChar(50), filters.transactionNumber ?? null),
  });

  return result.recordset;
}

export async function exportTransferOrders(
  direction: StockTransferDirection,
): Promise<TransferOrderExportRow | undefined> {
  const result = await executeProcedure<TransferOrderExportRow>(EXPORT_PROCEDURES[direction]);
  return result.recordset[0];
}
