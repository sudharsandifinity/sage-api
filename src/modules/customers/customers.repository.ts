import { executeProcedure, input, output, sql } from '../../db/executeProcedure.js';
import type { ListCustomersQuery } from './customers.schema.js';

export interface CustomerRow {
  CustomerId: string;
  CustomerName: string;
  City: string | null;
  Country: string | null;
  Balance: number | null;
  IsActive: boolean;
}

export interface ListCustomersResult {
  rows: CustomerRow[];
  total: number;
}

const LIST_CUSTOMERS_PROCEDURE = 'dbo.usp_GetCustomers';

export async function listCustomers(query: ListCustomersQuery): Promise<ListCustomersResult> {
  const result = await executeProcedure<CustomerRow>(LIST_CUSTOMERS_PROCEDURE, {
    Search: input(sql.NVarChar(100), query.search ?? null),
    Page: input(sql.Int, query.page),
    PageSize: input(sql.Int, query.pageSize),
    TotalCount: output(sql.Int),
  });

  return {
    rows: result.recordset,
    total: Number(result.output.TotalCount ?? 0),
  };
}
