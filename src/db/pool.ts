import sql from 'mssql';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

const poolConfig: sql.config = {
  server: env.DB_SERVER,
  port: env.DB_PORT,
  database: env.DB_NAME,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  connectionTimeout: env.DB_CONNECTION_TIMEOUT,
  requestTimeout: env.DB_REQUEST_TIMEOUT,
  options: {
    encrypt: env.DB_ENCRYPT,
    trustServerCertificate: env.DB_TRUST_SERVER_CERTIFICATE,
    enableArithAbort: true,
    ...(env.DB_INSTANCE ? { instanceName: env.DB_INSTANCE } : {}),
  },
  pool: {
    min: env.DB_POOL_MIN,
    max: env.DB_POOL_MAX,
    idleTimeoutMillis: env.DB_POOL_IDLE_TIMEOUT,
  },
};

let pool: sql.ConnectionPool | null = null;
let pending: Promise<sql.ConnectionPool> | null = null;

export async function getPool(): Promise<sql.ConnectionPool> {
  if (pool?.connected) {
    return pool;
  }

  if (!pending) {
    pending = new sql.ConnectionPool(poolConfig)
      .connect()
      .then((connected) => {
        connected.on('error', (error) => {
          logger.error({ err: error }, 'Database pool error');
        });
        pool = connected;
        logger.info({ server: env.DB_SERVER, database: env.DB_NAME }, 'Connected to database');
        return connected;
      })
      .catch((error: unknown) => {
        pool = null;
        throw error;
      })
      .finally(() => {
        pending = null;
      });
  }

  return pending;
}

export async function closePool(): Promise<void> {
  if (!pool) {
    return;
  }

  const current = pool;
  pool = null;
  await current.close();
  logger.info('Database pool closed');
}

export async function pingDatabase(): Promise<boolean> {
  const connection = await getPool();
  await connection.request().query('SELECT 1 AS ok');
  return true;
}
