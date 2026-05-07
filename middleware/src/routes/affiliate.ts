import { Router, Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
import { authenticate } from '../middleware/authenticate';
import { rateLimiter } from '../middleware/rateLimiter';
import * as fp from '../services/firstPromoter';

const router = Router();

router.use(authenticate as never);
router.use(rateLimiter);

function auth(req: Request): AuthenticatedRequest {
  return req as AuthenticatedRequest;
}

router.get('/me', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await fp.getMe(auth(req).affiliateToken);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

router.get('/referrals', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await fp.getReferrals(auth(req).affiliateToken, req.query as Record<string, string>);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

router.get('/commissions', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await fp.getCommissions(auth(req).affiliateToken, req.query as Record<string, string>);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

router.get('/payouts', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await fp.getPayouts(auth(req).affiliateToken, req.query as Record<string, string>);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

router.get('/promo-codes', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await fp.getPromoCodes(auth(req).affiliateToken);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

router.get('/referral-links', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await fp.getReferralLinks(auth(req).affiliateToken);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

router.get('/campaigns', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await fp.getCampaigns(auth(req).affiliateToken);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

router.get('/reports', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await fp.getReports(auth(req).affiliateToken, req.query as Record<string, string>);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

export default router;
