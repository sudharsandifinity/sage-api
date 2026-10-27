# Sage API

Node/Express REST API over Sage stored procedures (MS SQL Server).

## Stack

TypeScript · Express 5 · `mssql` (pooled) · Zod validation · Pino logging · Helmet/CORS/compression/rate limit.

## Setup

```bash
npm install
cp .env.example .env   # fill in DB credentials
npm run db:apply       # creates the schema and stored procedures
npm run dev
```

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Watch mode via tsx |
| `npm run build` | Compile to `dist/` |
| `npm start` | Run compiled build |
| `npm run db:apply` | Apply files from `sql/` (all, or the names you pass) |
| `npm run typecheck` | Type check only |

## Documentation

- [docs/API.md](docs/API.md) - full endpoint reference: parameters, stored procedures, databases, responses and error codes
- [docs/endpoints.csv](docs/endpoints.csv) - the same inventory as a spreadsheet
- [prod/DEPLOY.md](prod/DEPLOY.md) - Windows deployment and PM2 operations

## Endpoints

| Method | Path | Stored procedure |
| --- | --- | --- |
| GET | `/health/live` | - |
| GET | `/health/ready` | - (pings the database) |
| GET | `/api/v1/users` | `dbo.usp_GetAllUsers` |
| POST | `/api/v1/users` | `dbo.usp_CreateUser` |
| GET | `/api/v1/users/:id` | `dbo.usp_GetUserById` |
| PUT | `/api/v1/users/:id` | `dbo.usp_UpdateUser` |
| DELETE | `/api/v1/users/:id` | `dbo.usp_DeleteUser` |
| POST | `/api/v1/customer-outstanding/import?customerCode=` | `dbo.USP_IMPORT_SAGE_CUSTOMER_OUTSTANDING` |
| POST | `/api/v1/warehouse-stock/export` | `dbo.USP_EXPORT_WAREHOUSE_STOCK_TO_SONIC` |
| POST | `/api/v1/delivery-transactions/export?invoiceNumber=&includeRows=` | `dbo.USP_EXPORT_DELIVERY_TRANSACTIONS_TO_SONIC` |
| POST | `/api/v1/customers/import?billToCode=&includeRows=` | `dbo.USP_IMPORT_SAGE_CUSTOMER_TO_SONIC` |
| POST | `/api/v1/stock-movements/export?transactionId=&includeRows=` | `dbo.USP_EXPORT_SAGE_STOCK_MOVEMENTS_TO_SONIC` |
| POST | `/api/v1/customer-returns/asn-import` | `dbo.USP_IMPORT_CUSTOMER_RETURN_ASN_TO_X3` |
| POST | `/api/v1/items/import?itemCode=&categoryCode=` | `dbo.USP_IMPORT_SAGE_ITEM_TO_SONIC` |
| POST | `/api/v1/price-lists/import?priceListCode=` | `dbo.USP_IMPORT_SAGE_PRICELIST_TO_SONIC` |
| POST | `/api/v1/purchase-orders/:poNumber/export` | `dbo.USP_EXPORT_PURCHASEORDER_WMS_V1` |
| POST | `/api/v1/purchase-orders/:poNumber/asn-import` | `dbo.USP_IMPORT_ASN_TO_X3` |
| POST | `/api/v1/sales-orders/:soNumber/export` | `dbo.USP_EXPORT_SALESORDER_WMS_V1` |
| POST | `/api/v1/sales-orders/:soNumber/pick-confirmation` | `dbo.USP_GET_WM9_PICK_CONFIRMATION1` |
| POST | `/api/v1/sales-orders/push?orderNumber=` | `dbo.USP_PUSH_SALESORDER_TO_X3` |
| POST | `/api/v1/payments/push?paymentNumber=` | `dbo.USP_Payment_Integration` |
| GET | `/api/v1/customers?search=&page=&pageSize=` | `dbo.usp_GetCustomers` |

### Users

`POST` body: `name` (required, max 50), `email` (required, valid, max 50), `status` (optional, defaults to `active`).

`PUT` body: `name` and `email` required, `status` optional - when omitted the existing status is kept.

A duplicate email is rejected by `usp_CreateUser` / `usp_UpdateUser` with `THROW 50001`, which the API returns as HTTP 400 `DATABASE_RULE_VIOLATION`. A missing id returns 404.

## Layout

```
src/
  config/env.ts                 validated environment config
  db/pool.ts                    single shared connection pool
  db/executeProcedure.ts        generic stored procedure executor
  middleware/                   requestId, logging, validation, errors
  modules/users/                schema -> repository -> service -> controller -> routes
  modules/customers/            same pattern, placeholder procedure
  routes/                       health + versioned api router
  app.ts / server.ts            wiring and lifecycle
sql/                            schema migration + stored procedure definitions
scripts/apply-sql.ts            runs the files in sql/ against the configured database
```

## Adding a stored procedure endpoint

1. Create `src/modules/<name>/<name>.schema.ts` with the Zod request schema.
2. Create `<name>.repository.ts` and call `executeProcedure` with `input()` / `output()` params:

```ts
const result = await executeProcedure<MyRow>('dbo.usp_MyProc', {
  CompanyId: input(sql.NVarChar(10), query.companyId),
  AsOfDate: input(sql.Date, query.asOfDate),
  TotalCount: output(sql.Int),
});
```

3. Map rows to a camelCase DTO in `<name>.service.ts`.
4. Add the controller and router, then mount it in `src/routes/index.ts`.

All parameters are bound through `mssql` typed parameters, so values are never concatenated into SQL.

## Error contract

```json
{ "error": { "code": "VALIDATION_ERROR", "message": "...", "details": [], "requestId": "..." } }
```

`THROW`/`RAISERROR` with an error number `>= 50000` inside a procedure is surfaced as HTTP 400 with the procedure's message; anything else becomes a 500 and is logged with the stack.
