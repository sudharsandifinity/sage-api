const path = require('node:path');

try {
  require('dotenv').config({ path: path.join(__dirname, '.env') });
} catch {}

const sanitize = (value) =>
  String(value)
    .trim()
    .replace(/[^A-Za-z0-9._-]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^[-.]+|[-.]+$/g, '');

const appName = sanitize(process.env.PM2_APP_NAME || path.basename(__dirname)) || 'sage-api';

module.exports = {
  apps: [
    {
      name: appName,
      script: 'dist/server.js',
      cwd: __dirname,
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      max_memory_restart: '300M',
      out_file: 'logs/out.log',
      error_file: 'logs/err.log',
      merge_logs: true,
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
