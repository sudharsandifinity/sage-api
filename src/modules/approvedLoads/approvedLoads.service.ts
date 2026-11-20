import { AppError } from '../../utils/AppError.js';
import * as repository from './approvedLoads.repository.js';
import type {
  ApprovedLoadImportedHeaderRow,
  ApprovedLoadResultRow,
} from './approvedLoads.repository.js';
import type {
  ExportApprovedLoadsQuery,
  PushApprovedLoadsQuery,
} from './approvedLoads.schema.js';

export interface ApprovedLoadOutcome {
  orgCode: string | null;
  transactionId: string;
  erpMessage: string | null;
  isProcessed: number;
}

export interface PushApprovedLoadsResult {
  transactionId: string | null;
  total: number;
  successCount: number;
  failureCount: number;
  results: ApprovedLoadOutcome[];
}

export interface ImportedApprovedLoadHeader {
  transactionId: string;
  refTransactionId: string | null;
  warehouseCode: string | null;
  vehicleCode: string | null;
  transactionDate: string | null;
  transactionType: string | null;
}

export interface ExportApprovedLoadsResult {
  status: string;
  transactionId: string | null;
  insertedHeaders: number;
  insertedDetails: number;
  skippedEmptyReferences: number;
  skippedAmbiguousReferences: number;
  importedHeaderCount: number;
  headers?: ImportedApprovedLoadHeader[];
}

const toCount = (value: number | null | undefined): number => Number(value ?? 0);

const toIsoDate = (value: Date | string | null): string | null => {
  if (value === null || value === undefined) {
    return null;
  }
  return value instanceof Date ? value.toISOString() : String(value);
};

const toImportedHeader = (row: ApprovedLoadImportedHeaderRow): ImportedApprovedLoadHeader => ({
  transactionId: row.TransactionID,
  refTransactionId: row.RefTransactionID,
  warehouseCode: row.WarehouseCode,
  vehicleCode: row.VehicleCode,
  transactionDate: toIsoDate(row.TransactionDate),
  transactionType:
    row.TransactionType === null || row.TransactionType === undefined
      ? null
      : String(row.TransactionType),
});

const toOutcome = (row: ApprovedLoadResultRow): ApprovedLoadOutcome => ({
  orgCode: row.OrgCode,
  transactionId: row.TransactionID,
  erpMessage: row.ERPMessage === null || row.ERPMessage === '' ? null : row.ERPMessage,
  isProcessed: Number(row.IsProcessed ?? 0),
});

export async function pushApprovedLoads(
  filters: PushApprovedLoadsQuery,
): Promise<PushApprovedLoadsResult> {
  const { results, counts } = await repository.pushApprovedLoads(filters);
  const outcomes = results.map(toOutcome);
  const derivedSuccess = outcomes.filter((outcome) => outcome.isProcessed === 1).length;

  const successCount = counts === null ? derivedSuccess : Number(counts.SuccessCount ?? 0);
  const failureCount =
    counts === null ? outcomes.length - derivedSuccess : Number(counts.FailureCount ?? 0);

  return {
    transactionId: filters.transactionId ?? null,
    total: successCount + failureCount,
    successCount,
    failureCount,
    results: outcomes,
  };
}

export async function exportApprovedLoads(
  filters: ExportApprovedLoadsQuery,
): Promise<ExportApprovedLoadsResult> {
  const { summary, headers } = await repository.exportApprovedLoads(filters);

  if (summary === null) {
    throw new AppError(
      500,
      'APPROVED_LOAD_EXPORT_FAILED',
      'Approved load export returned no summary row',
    );
  }

  const status = String(summary.Status ?? '').trim().toUpperCase();

  if (status !== 'SUCCESS') {
    throw new AppError(400, 'APPROVED_LOAD_EXPORT_FAILED', summary.ErrorMessage ?? 'Approved load export failed', {
      status,
      transactionId: filters.transactionId ?? null,
      errorNumber: toCount(summary.ErrorNumber),
      errorLine: toCount(summary.ErrorLine),
    });
  }

  const result: ExportApprovedLoadsResult = {
    status,
    transactionId: filters.transactionId ?? null,
    insertedHeaders: toCount(summary.InsertedHeaders),
    insertedDetails: toCount(summary.InsertedDetails),
    skippedEmptyReferences: toCount(summary.SkippedEmptyReferences),
    skippedAmbiguousReferences: toCount(summary.SkippedAmbiguousReferences),
    importedHeaderCount: headers.length,
  };

  if (filters.includeRows) {
    result.headers = headers.map(toImportedHeader);
  }

  return result;
}
