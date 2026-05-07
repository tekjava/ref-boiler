import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../types';

export function errorHandler(
  err: ApiError | Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (isApiError(err)) {
    res.status(err.status).json({ code: err.code, message: err.message });
    return;
  }

  console.error('[unhandled]', err);
  res.status(500).json({ code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' });
}

function isApiError(err: unknown): err is ApiError {
  return (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    'message' in err &&
    'status' in err
  );
}
