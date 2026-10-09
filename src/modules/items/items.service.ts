import { AppError } from '../../utils/AppError.js';
import * as repository from './items.repository.js';
import type { ImportItemsQuery } from './items.schema.js';

export interface ImportItemsResult {
  status: string;
  processedUomRows: number;
  itemCode: string | null;
  categoryCode: string | null;
}

export async function importItems(filters: ImportItemsQuery): Promise<ImportItemsResult> {
  const row = await repository.importSageItems(filters);
  const status = String(row.Status ?? '').trim().toUpperCase();

  if (status !== 'SUCCESS') {
    throw new AppError(
      400,
      'ITEM_IMPORT_FAILED',
      row.Message ?? 'Item import failed',
      {
        itemCode: filters.itemCode ?? null,
        categoryCode: filters.categoryCode ?? null,
        ...(row.ErrorNumber === undefined ? {} : { errorNumber: Number(row.ErrorNumber) }),
        ...(row.ErrorLine === undefined ? {} : { errorLine: Number(row.ErrorLine) }),
      },
    );
  }

  return {
    status,
    processedUomRows: Number(row.ProcessedUOMRows ?? 0),
    itemCode: filters.itemCode ?? null,
    categoryCode: filters.categoryCode ?? null,
  };
}
