import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  affiliateId: string;
  affiliateToken: string;
}

export interface JwtPayload {
  sub: string;
  fpToken: string;
  iat: number;
  exp: number;
}

export interface ApiError {
  code: string;
  message: string;
  status: number;
}

export interface FpPromoter {
  id: number;
  cust_id: string | null;
  email: string;
  uid: string;
  first_name: string;
  last_name: string;
  earnings_balance: Record<string, number>;
  current_balance: Record<string, number>;
  paid_balance: Record<string, number>;
  auth_token: string;
}

export interface FpReferral {
  id: number;
  created_at: string;
  state: string;
  customer_id: string;
  email: string;
}

export interface FpCommission {
  id: number;
  created_at: string;
  amount: number;
  currency: string;
  status: string;
  referral_id: number;
}

export interface FpPayout {
  id: number;
  created_at: string;
  amount: number;
  currency: string;
  status: string;
}

export interface FpPromoCode {
  id: number;
  code: string;
  state: string;
}

export interface FpReferralLink {
  id: number;
  url: string;
  ref: string;
  campaign_id: number;
}

export interface FpCampaign {
  id: number;
  name: string;
  color: string;
}

export interface FpReport {
  clicks: number;
  unique_clicks: number;
  referrals: number;
  sales: number;
  cancellations: number;
  revenue: number;
  commissions: number;
}
