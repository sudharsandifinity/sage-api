import { executeProcedure, input, sql } from '../../db/executeProcedure.js';

export interface ExportSalesOrderRow {
  STATUS: number;
  MESSAGE: string;
}

const EXPORT_SALES_ORDER_TO_WMS = 'dbo.USP_EXPORT_SALESORDER_WMS_V1';

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
