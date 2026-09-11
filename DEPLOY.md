# Sage API - Production Deployment

Compiled build. No TypeScript, no build step needed on the server.

## Contents

```
dist/                compiled application
package.json         dependency manifest
package-lock.json    exact dependency versions
.env.example         configuration template
```

`src/`, `sql/` and `scripts/` are deliberately excluded. Never run `db:apply` against production - the SQL files in the repo are local learning procedures.

## 1. Prerequisites

Node.js 20 or newer on the server:

```
node -v
```

## 2. Copy and install

Copy this folder to the server, for example `C:\apps\sage-api`, then:

```
cd C:\apps\sage-api
npm ci --omit=dev
```

`npm ci` installs the exact versions from the lock file. `--omit=dev` skips TypeScript, tsx and pino-pretty, which production does not need.

## 3. Configure

```
copy .env.example .env
notepad .env
```

Fill in `DB_SERVER`, `DB_USER`, `DB_PASSWORD`, and set `CORS_ORIGIN` to the calling site. Keep `NODE_ENV=production` - it turns off pretty logging and stops error responses exposing internals.

Set `TRUST_PROXY=true` only if IIS or nginx sits in front of Node.

## 4. Database login

Do not connect as `sa`. On the X3 SQL Server:

```sql
CREATE LOGIN sage_api WITH PASSWORD = '<strong password>';
USE [x3];
CREATE USER sage_api FOR LOGIN sage_api;
GRANT EXECUTE ON dbo.USP_EXPORT_SALESORDER_WMS_V1 TO sage_api;
```

No table permissions. The API can execute that one procedure and nothing else.

## 5. First run

```
node dist/server.js
```

Expect `Connected to database` then `Sage API listening`. In another window:

```
curl http://localhost:3000/health/ready
```

`{"status":"ok","database":"up"}` means the connection works. A 503 means the database is unreachable - check `.env` and the SQL Server firewall before going further.

Stop it with Ctrl+C once verified.

## 6. Run as a Windows service

Using NSSM (https://nssm.cc), from an elevated prompt:

```
nssm install SageApi "C:\Program Files\nodejs\node.exe" "C:\apps\sage-api\dist\server.js"
nssm set SageApi AppDirectory C:\apps\sage-api
nssm set SageApi AppStdout C:\apps\sage-api\logs\out.log
nssm set SageApi AppStderr C:\apps\sage-api\logs\err.log
nssm set SageApi Start SERVICE_AUTO_START
nssm start SageApi
```

Create `C:\apps\sage-api\logs` first. Useful later:

```
nssm restart SageApi
nssm stop SageApi
nssm status SageApi
```

PM2 is the alternative if you prefer it:

```
npm install -g pm2 pm2-windows-startup
pm2 start dist/server.js --name sage-api
pm2 save
pm2-startup install
```

## 7. Test the endpoint

```
curl -X POST http://localhost:3000/api/v1/sales-orders/export
```

The sales order number is currently fixed at `SO00000002` in the compiled build.

This procedure writes: it inserts into `erp_int_wm9_Soimport` and sets `ZWMSFLAG_0 = '1'` on the order. The first successful call is a real WMS export, not a dry run.

Responses:

| Result | HTTP | Body |
| --- | --- | --- |
| `STATUS = 1` | 200 | `{ "data": { "salesOrder", "status", "message" } }` |
| `STATUS = 0` | 400 | `{ "error": { "code": "SALES_ORDER_EXPORT_FAILED", "message": <SP message> } }` |
| Database down | 503 | `{ "error": { "code": "DATABASE_UNAVAILABLE" } }` |

## 8. Monitoring

Point health checks at `GET /health/ready`. It pings SQL Server and returns 503 when the database is unreachable. `GET /health/live` answers without touching the database.

Every response carries an `X-Request-Id` header that also appears in the logs and in error bodies - use it to trace a specific call.

## Known limitations

- `/api/v1/users` and `/api/v1/customers` return 500 in production. They call procedures that exist only in the local `SP_test` database.
- There is no authentication. Anyone who can reach the port can trigger a WMS export. Restrict access by firewall until an API key or JWT layer is added.

## Redeploying

On the dev machine run `npm run build`, refresh `prod/dist`, then on the server:

```
nssm stop SageApi
```

replace `dist`, then:

```
nssm start SageApi
```

`npm ci --omit=dev` only needs re-running when `package.json` changes.
