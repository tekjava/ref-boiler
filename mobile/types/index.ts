export interface Promoter {
  id: number;
  email: string;
  uid: string;
  first_name: string;
  last_name: string;
  earnings_balance: Record<string, number>;
  current_balance: Record<string, number>;
  paid_balance: Record<string, number>;
  auth_token: string;
}

export interface Referral {
  id: number;
  created_at: string;
  state: string;
  customer_id: string;
  email: string;
}

export interface Commission {
  id: number;
  created_at: string;
  amount: number;
  currency: string;
  status: string;
  referral_id: number;
}

export interface Payout {
  id: number;
  created_at: string;
  amount: number;
  currency: string;
  status: string;
}

export interface PromoCode {
  id: number;
  code: string;
  state: string;
}

export interface ReferralLink {
  id: number;
  url: string;
  ref: string;
  campaign_id: number;
}

export interface Campaign {
  id: number;
  name: string;
  color: string;
}

export interface Report {
  clicks: number;
  unique_clicks: number;
  referrals: number;
  sales: number;
  cancellations: number;
  revenue: number;
  commissions: number;
}
