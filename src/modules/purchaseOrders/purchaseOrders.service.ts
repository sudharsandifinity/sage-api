import { AppError } from '../../utils/AppError.js';
import * as repository from './purchaseOrders.repository.js';

export interface ExportPurchaseOrderResult {
  purchaseOrder: string;
  status: number;
  message: string;
}

export interface AsnImportResult {
  purchaseOrder: string;
  status: number;
  insertedRows: number;
  message: string;
}

export async function exportPurchaseOrder(poNumber: string): Promise<ExportPurchaseOrderResult> {
  const row = await repository.exportPurchaseOrderToWms(poNumber);
  const status = Number(row.STATUS);
  const message = row.MESSAGE;

  if (status !== 1) {
    throw new AppError(400, 'PURCHASE_ORDER_EXPORT_FAILED', message, {
      purchaseOrder: poNumber,
    });
  }

  return { purchaseOrder: poNumber, status, message };
}

export async function importAsn(poNumber: string): Promise<AsnImportResult> {
  const row = await repository.importAsnToX3(poNumber);
  const status = Number(row.STATUS);
  const insertedRows = Number(row.INSERTED_ROWS ?? 0);
  const message = row.MESSAGE;

  if (status !== 1) {
    throw new AppError(400, 'ASN_IMPORT_FAILED', message, {
      purchaseOrder: poNumber,
      insertedRows,
      ...(row.ERROR_NUMBER === undefined ? {} : { errorNumber: Number(row.ERROR_NUMBER) }),
      ...(row.ERROR_LINE === undefined ? {} : { errorLine: Number(row.ERROR_LINE) }),
    });
  }

  return { purchaseOrder: poNumber, status, insertedRows, message };
}
