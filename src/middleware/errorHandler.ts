import type { ErrorRequestHandler } from 'express';
import sql from 'mssql';
import { ZodError } from 'zod';
import { AppError } from '../utils/AppError.js';
import { logger } from '../utils/logger.js';

interface ErrorPayload {
  statusCode: number;
  code: string;
  message: string;
  details?: unknown;
}

const SQL_USER_ERROR_THRESHOLD = 50_000;

const resolveSqlErrorNumber = (error: sql.RequestError): number | undefined => {
  const original = error.originalError as { info?: { number?: number } } | undefined;
  return original?.info?.number ?? error.number;
};

const toPayload = (error: unknown): ErrorPayload => {
  if (error instanceof AppError) {
    return {
      statusCode: error.statusCode,
      code: error.code,
      message: error.message,
      details: error.details,
    };
  }

  if (error instanceof ZodError) {
    return {
      statusCode: 400,
      code: 'VALIDATION_ERROR',
      message: 'Request validation failed',
      details: error.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      })),
    };
  }

  if (error instanceof sql.RequestError) {
    const number = resolveSqlErrorNumber(error);
    if (typeof number === 'number' && number >= SQL_USER_ERROR_THRESHOLD) {
      return {
        statusCode: 400,
        code: 'DATABASE_RULE_VIOLATION',
        message: error.message,
      };
    }
    return {
      statusCode: 500,
      code: 'DATABASE_ERROR',
      message: 'Database request failed',
    };
  }

  if (error instanceof sql.ConnectionError || error instanceof sql.TransactionError) {
    return {
      statusCode: 503,
      code: 'DATABASE_UNAVAILABLE',
      message: 'Database is unavailable',
    };
  }

  return {
    statusCode: 500,
    code: 'INTERNAL_ERROR',
    message: 'Internal server error',
  };
};

export const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  if (res.headersSent) {
    next(error);
    return;
  }

  const payload = toPayload(error);
  const requestId = res.locals.requestId;
  const log = req.log ?? logger;

  if (payload.statusCode >= 500) {
    log.error({ err: error, requestId }, payload.message);
  } else {
    log.warn({ err: error, requestId }, payload.message);
  }

  res.status(payload.statusCode).json({
    error: {
      code: payload.code,
      message: payload.message,
      ...(payload.details !== undefined && payload.statusCode < 500
        ? { details: payload.details }
        : {}),
      requestId,
    },
  });
};
