import { AppError } from '../../utils/AppError.js';
import * as repository from './salesOrders.repository.js';
import type { PickConfirmationLineRow } from './salesOrders.repository.js';

export interface ExportResult {
  salesOrder: string;
  status: number;
  message: string;
}

export interface PickConfirmationLine {
  salesOrder: string;
  lineNumber: number;
  itemCode: string;
  pickedQuantity: number | null;
  importFlag: number | null;
}

export interface PickConfirmationResult {
  salesOrder: string;
  status: number;
  message: string;
  lines: PickConfirmationLine[];
}

const toLine = (row: PickConfirmationLineRow): PickConfirmationLine => ({
  salesOrder: row.SOHNUM_0,
  lineNumber: Number(row.SOPLIN_0),
  itemCode: row.ITMREF_0,
  pickedQuantity: row.ZWMSQTY_0 === null ? null : Number(row.ZWMSQTY_0),
  importFlag: row.ZIMPFLG_0 === null ? null : Number(row.ZIMPFLG_0),
});

export async function exportSalesOrder(soNumber: string): Promise<ExportResult> {
  const row = await repository.exportSalesOrderToWms(soNumber);
  const status = Number(row.STATUS);
  const message = row.MESSAGE;

  if (status !== 1) {
    throw new AppError(400, 'SALES_ORDER_EXPORT_FAILED', message, { salesOrder: soNumber });
  }

  return { salesOrder: soNumber, status, message };
}

export async function confirmPick(soNumber: string): Promise<PickConfirmationResult> {
  const { status, lines } = await repository.getPickConfirmation(soNumber);
  const code = Number(status.STATUS);
  const message = status.MESSAGE;

  if (code !== 1) {
    throw new AppError(400, 'PICK_CONFIRMATION_FAILED', message, {
      salesOrder: soNumber,
      ...(status.ERROR_NUMBER === undefined ? {} : { errorNumber: Number(status.ERROR_NUMBER) }),
      ...(status.ERROR_LINE === undefined ? {} : { errorLine: Number(status.ERROR_LINE) }),
    });
  }

  return { salesOrder: soNumber, status: code, message, lines: lines.map(toLine) };
}
