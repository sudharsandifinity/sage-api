import { executeProcedure, input, sql } from '../../db/executeProcedure.js';
import type { PushApprovedLoadsQuery } from './approvedLoads.schema.js';

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

const APPROVED_LOAD_INTEGRATION = 'dbo.USP_ApprovedLoadIntegration';

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
