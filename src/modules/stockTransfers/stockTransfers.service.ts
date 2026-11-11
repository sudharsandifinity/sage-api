import * as repository from './stockTransfers.repository.js';
import type { StockTransferDirection, StockTransferResultRow } from './stockTransfers.repository.js';
import type { PushStockTransfersQuery } from './stockTransfers.schema.js';

export interface StockTransferOutcome {
  transactionNumber: string;
  sequenceNumber: string | null;
  succeeded: boolean;
  erpMessage: string | null;
}

export interface PushStockTransfersResult {
  direction: StockTransferDirection;
  transactionNumber: string | null;
  total: number;
  successCount: number;
  failureCount: number;
  results: StockTransferOutcome[];
}

const SUCCESS_MESSAGE = 'successfully inserted into sage x3.';

const toOutcome = (row: StockTransferResultRow): StockTransferOutcome => {
  const message = row.ERPMessage;
  const succeeded = String(message ?? '').trim().toLowerCase() === SUCCESS_MESSAGE;

  return {
    transactionNumber: row.TransactionNumber,
    sequenceNumber: row.SequenceNumber,
    succeeded,
    erpMessage: succeeded ? null : message,
  };
};

export async function pushStockTransfers(
  direction: StockTransferDirection,
  filters: PushStockTransfersQuery,
): Promise<PushStockTransfersResult> {
  const rows = await repository.pushStockTransfers(direction, filters);
  const results = rows.map(toOutcome);
  const successCount = results.filter((outcome) => outcome.succeeded).length;

  return {
    direction,
    transactionNumber: filters.transactionNumber ?? null,
    total: results.length,
    successCount,
    failureCount: results.length - successCount,
    results,
  };
}
