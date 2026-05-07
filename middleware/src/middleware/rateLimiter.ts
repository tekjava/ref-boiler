import rateLimit from 'express-rate-limit';

export const rateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  // Key per authenticated affiliate so limits are per-user, not per-IP
  keyGenerator: (req) => (req as { affiliateId?: string }).affiliateId ?? req.ip ?? 'anon',
  standardHeaders: true,
  legacyHeaders: false,
  message: { code: 'RATE_LIMITED', message: 'Too many requests — try again shortly' },
});
