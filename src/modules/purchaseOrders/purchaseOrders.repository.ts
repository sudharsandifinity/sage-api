import { executeProcedure, input, sql } from '../../db/executeProcedure.js';

export interface ExportPurchaseOrderRow {
  STATUS: number;
  MESSAGE: string;
}

export interface AsnImportRow {
  STATUS: number;
  INSERTED_ROWS: number;
  PONUMBER?: string;
  MESSAGE: string;
  ERROR_NUMBER?: number;
  ERROR_LINE?: number;
}

const EXPORT_PURCHASE_ORDER_TO_WMS = 'dbo.USP_EXPORT_PURCHASEORDER_WMS_V1';
const IMPORT_ASN_TO_X3 = 'dbo.USP_IMPORT_ASN_TO_X3';

export async function exportPurchaseOrderToWms(
  poNumber: string,
): Promise<ExportPurchaseOrderRow> {
  const result = await executeProcedure<ExportPurchaseOrderRow>(EXPORT_PURCHASE_ORDER_TO_WMS, {
    PONUMBER: input(sql.VarChar(30), poNumber),
  });

  const row = result.recordset[0];
  if (!row) {
    throw new Error(`${EXPORT_PURCHASE_ORDER_TO_WMS} did not return a status row`);
  }

  return row;
}

export async function importAsnToX3(poNumber: string): Promise<AsnImportRow> {
  const result = await executeProcedure<AsnImportRow>(IMPORT_ASN_TO_X3, {
    SAGEPONUMBER: input(sql.VarChar(50), poNumber),
  });

  const row = result.recordset[0];
  if (!row) {
    throw new Error(`${IMPORT_ASN_TO_X3} did not return a status row`);
  }

  return row;
}
