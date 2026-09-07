import { AppError } from '../../utils/AppError.js';
import * as repository from './salesOrders.repository.js';

export const STATIC_SALES_ORDER_NUMBER = 'SO00000002';

export interface ExportResult {
  salesOrder: string;
  status: number;
  message: string;
}

export async function exportSalesOrder(soNumber: string): Promise<ExportResult> {
  const row = await repository.exportSalesOrderToWms(soNumber);
  const status = Number(row.STATUS);
  const message = row.MESSAGE;

  if (status !== 1) {
    throw new AppError(400, 'SALES_ORDER_EXPORT_FAILED', message, { salesOrder: soNumber });
  }

  return { salesOrder: soNumber, status, message };
}
