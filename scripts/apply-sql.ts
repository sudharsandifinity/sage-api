import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { closePool, getPool } from '../src/db/pool.js';
import { logger } from '../src/utils/logger.js';

const SQL_DIR = path.resolve(process.cwd(), 'sql');

const main = async (): Promise<void> => {
  const requested = process.argv.slice(2);
  const files = requested.length > 0
    ? requested
    : (await readdir(SQL_DIR)).filter((file) => file.endsWith('.sql')).sort();

  const pool = await getPool();

  for (const file of files) {
    const contents = await readFile(path.join(SQL_DIR, file), 'utf8');
    const batches = contents
      .split(/^\s*GO\s*$/gim)
      .map((batch) => batch.trim())
      .filter(Boolean);

    for (const batch of batches) {
      await pool.request().batch(batch);
    }
    logger.info({ file }, 'Applied SQL file');
  }

  await closePool();
};

main().catch((error: unknown) => {
  logger.fatal({ err: error }, 'Failed to apply SQL');
  process.exit(1);
});
