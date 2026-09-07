import 'express';

declare global {
  namespace Express {
    interface Request {
      validated?: {
        body: unknown;
        query: unknown;
        params: unknown;
      };
    }

    interface Locals {
      requestId: string;
    }
  }
}

export {};
