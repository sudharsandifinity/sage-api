import pino from 'pino';
import { env, isProduction } from '../config/env.js';

export const logger = pino({
  level: env.LOG_LEVEL,
  base: { service: 'sage-api-1' },
  redact: {
    paths: ['req.headers.authorization', 'req.headers.cookie', 'DB_PASSWORD'],
    remove: true,
  },
  ...(isProduction
    ? {}
    : {
        transport: {
          target: 'pino-pretty',
          options: { colorize: true, translateTime: 'SYS:standard', ignore: 'pid,hostname' },
        },
      }),
});
