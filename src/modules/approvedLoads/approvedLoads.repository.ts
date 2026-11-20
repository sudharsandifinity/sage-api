import { executeProcedure, input, sql } from '../../db/executeProcedure.js';
import type {
  ExportApprovedLoadsQuery,
  PushApprovedLoadsQuery,
} from './approvedLoads.schema.js';

export interface ApprovedLoadResultRow {
  OrgCode: string | null;
  TransactionID: string;
  ERPMessage: string | null;
  IsProcessed: number | null;
}

export interface ApprovedLoadCountRow {
  SuccessCount: number;
  FailureCount: number;
}

export interface ApprovedLoadPushRaw {
  results: ApprovedLoadResultRow[];
  counts: ApprovedLoadCountRow | null;
}

export interface ApprovedLoadSummaryRow {
  Status: string;
  InsertedHeaders?: number | null;
  InsertedDetails?: number | null;
  SkippedEmptyReferences?: number | null;
  SkippedAmbiguousReferences?: number | null;
  ErrorNumber?: number | null;
  ErrorMessage?: string | null;
  ErrorLine?: number | null;
}

export interface ApprovedLoadImportedHeaderRow {
  TransactionID: string;
  RefTransactionID: string | null;
  WarehouseCode: string | null;
  VehicleCode: string | null;
  TransactionDate: Date | string | null;
  TransactionType: string | number | null;
}

export interface ApprovedLoadExportRaw {
  summary: ApprovedLoadSummaryRow | null;
  headers: ApprovedLoadImportedHeaderRow[];
}

const APPROVED_LOAD_INTEGRATION = 'dbo.USP_ApprovedLoadIntegration';
const EXPORT_APPROVED_LOAD = 'dbo.USP_EXPORT_SAGE_APPROVED_LOAD_TO_SONIC';

export async function pushApprovedLoads(
  filters: PushApprovedLoadsQuery,
): Promise<ApprovedLoadPushRaw> {
  const result = await executeProcedure<Record<string, unknown>>(APPROVED_LOAD_INTEGRATION, {
    TransactionID: input(sql.NVarChar(50), filters.transactionId ?? null),
  });

  const sets = result.recordsets;

  return {
    results: ((sets[0] ?? []) as unknown) as ApprovedLoadResultRow[],
    counts: (sets[1]?.[0] as ApprovedLoadCountRow | undefined) ?? null,
  };
}

export async function exportApprovedLoads(
  filters: ExportApprovedLoadsQuery,
): Promise<ApprovedLoadExportRaw> {
  const result = await executeProcedure<Record<string, unknown>>(EXPORT_APPROVED_LOAD, {
    TransactionID: input(sql.NVarChar(50), filters.transactionId ?? null),
  });

  const sets = result.recordsets;

  return {
    summary: (sets[0]?.[0] as ApprovedLoadSummaryRow | undefined) ?? null,
    headers: ((sets[1] ?? []) as unknown) as ApprovedLoadImportedHeaderRow[],
  };
}
