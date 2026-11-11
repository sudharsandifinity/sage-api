import { executeProcedure, input, sql } from '../../db/executeProcedure.js';
import type { PushStockTransfersQuery } from './stockTransfers.schema.js';

export interface StockTransferResultRow {
  TransactionNumber: string;
  SequenceNumber: string | null;
  ERPMessage: string | null;
}

const EXPORT_STOCK_TRANSFER_LOAD = 'dbo.USP_EXPORT_SAGE_STOCK_TRANSFER_LOAD';

export async function pushStockTransfers(
  filters: PushStockTransfersQuery,
): Promise<StockTransferResultRow[]> {
  const result = await executeProcedure<StockTransferResultRow>(EXPORT_STOCK_TRANSFER_LOAD, {
    TransactionNumber: input(sql.NVarChar(50), filters.transactionNumber ?? null),
  });

  return result.recordset;
}
