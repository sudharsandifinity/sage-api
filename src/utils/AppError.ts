export class AppError extends Error {
  readonly statusCode: number;
  readonly code: string;
  readonly details?: unknown;
  readonly expose: boolean;

  constructor(statusCode: number, code: string, message: string, details?: unknown) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.expose = statusCode < 500;
    Error.captureStackTrace(this, AppError);
  }

  static badRequest(message: string, details?: unknown): AppError {
    return new AppError(400, 'BAD_REQUEST', message, details);
  }

  static notFound(message = 'Resource not found', details?: unknown): AppError {
    return new AppError(404, 'NOT_FOUND', message, details);
  }

  static conflict(message: string, details?: unknown): AppError {
    return new AppError(409, 'CONFLICT', message, details);
  }

  static unprocessable(message: string, details?: unknown): AppError {
    return new AppError(422, 'UNPROCESSABLE_ENTITY', message, details);
  }

  static internal(message = 'Internal server error', details?: unknown): AppError {
    return new AppError(500, 'INTERNAL_ERROR', message, details);
  }

  static serviceUnavailable(message = 'Service unavailable', details?: unknown): AppError {
    return new AppError(503, 'SERVICE_UNAVAILABLE', message, details);
  }
}
