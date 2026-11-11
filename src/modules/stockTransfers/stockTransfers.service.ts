import { AppError } from '../../utils/AppError.js';
import * as repository from './stockTransfers.repository.js';
import type {
  StockTransferDirection,
  StockTransferResultRow,
  TransferOrderExportRow,
} from './stockTransfers.repository.js';
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

export interface ExportTransferOrdersResult {
  direction: StockTransferDirection;
  exported: boolean;
  sageDetailLines: number;
  wmsLines: number;
  processedHeaders: number;
  message: string;
}

const SUCCESS_MESSAGE = 'successfully inserted into sage x3.';
const SQL_USER_ERROR_THRESHOLD = 50_000;

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

const toCount = (value: number | null | undefined): number => Number(value ?? 0);

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

export async function exportTransferOrders(
  direction: StockTransferDirection,
): Promise<ExportTransferOrdersResult> {
  const row: TransferOrderExportRow | undefined =
    await repository.exportTransferOrders(direction);

  if (!row) {
    throw new AppError(
      500,
      'TRANSFER_ORDER_EXPORT_FAILED',
      'Transfer order export returned no result row',
    );
  }

  if (row.ErrorNumber !== undefined && row.ErrorNumber !== null) {
    const number = Number(row.ErrorNumber);
    const message = row.ErrorMessage ?? 'Transfer order export failed';
    const details = { errorNumber: number, errorLine: toCount(row.ErrorLine) };

    if (number >= SQL_USER_ERROR_THRESHOLD) {
      throw new AppError(400, 'TRANSFER_ORDER_EXPORT_FAILED', message, details);
    }

    throw new AppError(500, 'TRANSFER_ORDER_EXPORT_FAILED', message, details);
  }

  if (row.Result !== undefined && row.Result !== null) {
    return {
      direction,
      exported: false,
      sageDetailLines: 0,
      wmsLines: 0,
      processedHeaders: 0,
      message: row.Result,
    };
  }

  return {
    direction,
    exported: true,
    sageDetailLines: toCount(row.TotalSageDetailLines),
    wmsLines: toCount(row.TotalWMSLines),
    processedHeaders: toCount(row.ProcessedHeaders),
    message: 'Transfer orders exported to WMS',
  };
}
