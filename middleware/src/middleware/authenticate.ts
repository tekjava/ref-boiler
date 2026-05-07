import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest, JwtPayload } from '../types';

export function authenticate(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ code: 'MISSING_TOKEN', message: 'Authorization header required' });
    return;
  }

  const token = authHeader.slice(7);
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    res.status(500).json({ code: 'SERVER_MISCONFIGURED', message: 'JWT secret not set' });
    return;
  }

  try {
    const payload = jwt.verify(token, secret) as JwtPayload;
    req.affiliateId = payload.sub;
    req.affiliateToken = payload.fpToken;
    next();
  } catch {
    res.status(401).json({ code: 'INVALID_TOKEN', message: 'Token is invalid or expired' });
  }
}
