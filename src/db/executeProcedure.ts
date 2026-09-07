import sql from 'mssql';
import { getPool } from './pool.js';

export type SqlType = sql.ISqlType | (() => sql.ISqlType);

export interface ProcedureParam {
  type: SqlType;
  value?: unknown;
  direction?: 'input' | 'output';
}

export type ProcedureParams = Record<string, ProcedureParam>;

export interface ProcedureResult<TRecord> {
  recordset: TRecord[];
  recordsets: TRecord[][];
  output: Record<string, unknown>;
  returnValue: number;
  rowsAffected: number[];
}

export async function executeProcedure<TRecord = Record<string, unknown>>(
  procedureName: string,
  params: ProcedureParams = {},
): Promise<ProcedureResult<TRecord>> {
  const pool = await getPool();
  const request = pool.request();

  for (const [name, param] of Object.entries(params)) {
    if (param.direction === 'output') {
      request.output(name, param.type, param.value ?? null);
    } else {
      request.input(name, param.type, param.value ?? null);
    }
  }

  const result = await request.execute<TRecord>(procedureName);

  return {
    recordset: (result.recordset ?? []) as TRecord[],
    recordsets: (result.recordsets ?? []) as unknown as TRecord[][],
    output: (result.output ?? {}) as Record<string, unknown>,
    returnValue: result.returnValue,
    rowsAffected: result.rowsAffected ?? [],
  };
}

export const input = (type: SqlType, value: unknown): ProcedureParam => ({
  type,
  value,
  direction: 'input',
});

export const output = (type: SqlType, value?: unknown): ProcedureParam => ({
  type,
  value,
  direction: 'output',
});

export { sql };
