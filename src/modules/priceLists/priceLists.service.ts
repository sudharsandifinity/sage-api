import { AppError } from '../../utils/AppError.js';
import * as repository from './priceLists.repository.js';
import type { ImportPriceListQuery } from './priceLists.schema.js';

export interface PriceListImportResult {
  status: string;
  priceListCode: string | null;
  priceDefinitionRecords: number;
  priceAssignmentRecords: number;
  message: string | null;
}

const ACCEPTED_STATUSES = new Set(['SUCCESS', 'NO DATA']);

export async function importPriceList(
  filters: ImportPriceListQuery,
): Promise<PriceListImportResult> {
  const row = await repository.importSagePriceList(filters);
  const status = String(row.Status ?? '').trim().toUpperCase();

  if (!ACCEPTED_STATUSES.has(status)) {
    throw new AppError(
      400,
      'PRICE_LIST_IMPORT_FAILED',
      row.ErrorMessage ?? row.Message ?? 'Price list import failed',
      {
        priceListCode: filters.priceListCode ?? null,
        ...(row.ErrorNumber === undefined ? {} : { errorNumber: Number(row.ErrorNumber) }),
        ...(row.ErrorLine === undefined ? {} : { errorLine: Number(row.ErrorLine) }),
      },
    );
  }

  return {
    status,
    priceListCode: filters.priceListCode ?? null,
    priceDefinitionRecords: Number(row.PriceDefinitionRecords ?? 0),
    priceAssignmentRecords: Number(row.PriceAssignmentRecords ?? 0),
    message: row.Message ?? null,
  };
}
