import { listCustomers as listCustomersFromDb } from './customers.repository.js';
import type { CustomerRow } from './customers.repository.js';
import type { ListCustomersQuery } from './customers.schema.js';

export interface Customer {
  customerId: string;
  customerName: string;
  city: string | null;
  country: string | null;
  balance: number | null;
  isActive: boolean;
}

export interface PaginatedCustomers {
  data: Customer[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

const toCustomer = (row: CustomerRow): Customer => ({
  customerId: row.CustomerId,
  customerName: row.CustomerName,
  city: row.City,
  country: row.Country,
  balance: row.Balance === null ? null : Number(row.Balance),
  isActive: Boolean(row.IsActive),
});

export async function getCustomers(query: ListCustomersQuery): Promise<PaginatedCustomers> {
  const { rows, total } = await listCustomersFromDb(query);

  return {
    data: rows.map(toCustomer),
    meta: {
      page: query.page,
      pageSize: query.pageSize,
      total,
      totalPages: total === 0 ? 0 : Math.ceil(total / query.pageSize),
    },
  };
}
