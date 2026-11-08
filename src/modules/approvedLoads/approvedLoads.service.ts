import * as repository from './approvedLoads.repository.js';
import type { ApprovedLoadResultRow } from './approvedLoads.repository.js';
import type { PushApprovedLoadsQuery } from './approvedLoads.schema.js';

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
