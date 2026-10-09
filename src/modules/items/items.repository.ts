import { executeProcedure, input, sql } from '../../db/executeProcedure.js';
import type { ImportItemsQuery } from './items.schema.js';

export interface ImportItemsRow {
  Status: string;
  ProcessedUOMRows?: number;
  Message?: string;
  ErrorNumber?: number;
  ErrorLine?: number;
}

const IMPORT_SAGE_ITEM_TO_SONIC = 'dbo.USP_IMPORT_SAGE_ITEM_TO_SONIC';

export async function importSageItems(filters: ImportItemsQuery): Promise<ImportItemsRow> {
  const result = await executeProcedure<ImportItemsRow>(IMPORT_SAGE_ITEM_TO_SONIC, {
    ITMREF: input(sql.VarChar(50), filters.itemCode ?? null),
    ItemCategoryCode: input(sql.VarChar(50), filters.categoryCode ?? null),
  });

  const row = result.recordset[0];
  if (!row) {
    throw new Error(`${IMPORT_SAGE_ITEM_TO_SONIC} did not return a status row`);
  }

  return row;
}
