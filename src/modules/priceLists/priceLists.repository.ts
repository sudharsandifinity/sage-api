import { executeProcedure, input, sql } from '../../db/executeProcedure.js';
import type { ImportPriceListQuery } from './priceLists.schema.js';

export interface PriceListImportRow {
  Status: string;
  Message?: string;
  PriceListCode?: string;
  PriceDefinitionRecords?: number;
  PriceAssignmentRecords?: number;
  ErrorNumber?: number;
  ErrorMessage?: string;
  ErrorLine?: number;
  ErrorProcedure?: string;
}

const IMPORT_PRICELIST_TO_SONIC = 'dbo.USP_IMPORT_SAGE_PRICELIST_TO_SONIC';

export async function importSagePriceList(
  filters: ImportPriceListQuery,
): Promise<PriceListImportRow> {
  const result = await executeProcedure<PriceListImportRow>(IMPORT_PRICELIST_TO_SONIC, {
    PriceListCode: input(sql.VarChar(50), filters.priceListCode ?? null),
  });

  const row = result.recordset[0];
  if (!row) {
    throw new Error(`${IMPORT_PRICELIST_TO_SONIC} did not return a status row`);
  }

  return row;
}
