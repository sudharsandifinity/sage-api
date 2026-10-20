import * as repository from './warehouseStock.repository.js';

export interface WarehouseStockExportResult {
  status: string;
  recordCount: number | null;
  messages: string[];
}

const RECORD_COUNT_PATTERN = /records inserted:\s*(\d+)/i;
const SEPARATOR_PATTERN = /^=+$/;

const isReadable = (message: string): boolean => {
  const trimmed = message.trim();
  return trimmed.length > 0 && !SEPARATOR_PATTERN.test(trimmed);
};

export async function exportWarehouseStock(): Promise<WarehouseStockExportResult> {
  const { messages, rowsAffected } = await repository.exportWarehouseStock();

  const match = messages.map((message) => RECORD_COUNT_PATTERN.exec(message)).find(Boolean);
  const fromMessage = match?.[1] === undefined ? null : Number(match[1]);
  const fromRowsAffected = rowsAffected.length === 0 ? null : Math.max(...rowsAffected);

  return {
    status: 'SUCCESS',
    recordCount: fromMessage ?? fromRowsAffected,
    messages: messages.map((message) => message.trim()).filter(isReadable),
  };
}
