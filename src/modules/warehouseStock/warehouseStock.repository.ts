import { executeProcedure } from '../../db/executeProcedure.js';

export interface WarehouseStockExportRaw {
  messages: string[];
  rowsAffected: number[];
}

const EXPORT_WAREHOUSE_STOCK = 'dbo.USP_EXPORT_WAREHOUSE_STOCK_TO_SONIC';

export async function exportWarehouseStock(): Promise<WarehouseStockExportRaw> {
  const result = await executeProcedure(EXPORT_WAREHOUSE_STOCK);

  return { messages: result.messages, rowsAffected: result.rowsAffected };
}
