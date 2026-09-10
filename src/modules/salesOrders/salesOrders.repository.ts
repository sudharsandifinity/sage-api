import { executeProcedure, input, sql } from '../../db/executeProcedure.js';

export interface ExportSalesOrderRow {
  STATUS: number;
  MESSAGE: string;
}

export interface PickConfirmationStatusRow {
  STATUS: number;
  MESSAGE: string;
  ERROR_NUMBER?: number;
  ERROR_LINE?: number;
}

export interface PickConfirmationLineRow {
  SOHNUM_0: string;
  SOPLIN_0: number;
  ITMREF_0: string;
  ZWMSQTY_0: number | null;
  ZIMPFLG_0: number | null;
}

export interface PickConfirmationResult {
  status: PickConfirmationStatusRow;
  lines: PickConfirmationLineRow[];
}

const EXPORT_SALES_ORDER_TO_WMS = 'dbo.USP_EXPORT_SALESORDER_WMS_V1';
const PICK_CONFIRMATION = 'dbo.USP_GET_WM9_PICK_CONFIRMATION1';

export async function exportSalesOrderToWms(soNumber: string): Promise<ExportSalesOrderRow> {
  const result = await executeProcedure<ExportSalesOrderRow>(EXPORT_SALES_ORDER_TO_WMS, {
    SOHNUM: input(sql.VarChar(30), soNumber),
  });

  const row = result.recordset[0];
  if (!row) {
    throw new Error(`${EXPORT_SALES_ORDER_TO_WMS} did not return a status row`);
  }

  return row;
}

export async function getPickConfirmation(soNumber: string): Promise<PickConfirmationResult> {
  const result = await executeProcedure<Record<string, unknown>>(PICK_CONFIRMATION, {
    SOHNUM: input(sql.VarChar(20), soNumber),
  });

  const sets = result.recordsets;
  const statusRow = sets[sets.length - 1]?.[0] as PickConfirmationStatusRow | undefined;

  if (!statusRow) {
    throw new Error(`${PICK_CONFIRMATION} did not return a status row`);
  }

  const lines = sets.length > 1 ? ((sets[0] ?? []) as unknown as PickConfirmationLineRow[]) : [];

  return { status: statusRow, lines };
}
