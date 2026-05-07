import { Router, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { loginAffiliate } from '../services/firstPromoter';

const router = Router();

router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body as { email?: string; password?: string };

  if (!email || !password) {
    res.status(400).json({ code: 'MISSING_CREDENTIALS', message: 'email and password are required' });
    return;
  }

  try {
    const fpData = await loginAffiliate(email, password);
    const fpToken: string = fpData.auth_token;
    const affiliateId: string = String(fpData.id);

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      res.status(500).json({ code: 'SERVER_MISCONFIGURED', message: 'JWT secret not set' });
      return;
    }

    const token = jwt.sign(
      { sub: affiliateId, fpToken },
      secret,
      { expiresIn: '30d' },
    );

    res.json({ token });
  } catch (err) {
    next(err);
  }
});

export default router;
