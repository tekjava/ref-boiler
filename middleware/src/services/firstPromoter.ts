import axios, { AxiosInstance, AxiosError } from 'axios';
import { ApiError } from '../types';

const FP_BASE_URL = 'https://firstpromoter.com/api/v2/affiliate';

function buildFpClient(affiliateToken: string): AxiosInstance {
  return axios.create({
    baseURL: FP_BASE_URL,
    headers: {
      Authorization: `Bearer ${process.env.FIRSTPROMOTER_API_KEY}`,
      'X-Api-Account': process.env.FIRSTPROMOTER_ACCOUNT_ID ?? '',
      // Scoped to the authenticated affiliate via their FP auth token
      'X-Affiliate-Token': affiliateToken,
      'Content-Type': 'application/json',
    },
    timeout: 10_000,
  });
}

function normalizeFpError(err: unknown): ApiError {
  if (err instanceof AxiosError) {
    const status = err.response?.status ?? 502;
    const fpMessage =
      err.response?.data?.message ??
      err.response?.data?.error ??
      'FirstPromoter request failed';
    return { code: 'FP_ERROR', message: String(fpMessage), status };
  }
  return { code: 'FP_ERROR', message: 'Unexpected upstream error', status: 502 };
}

export async function getMe(affiliateToken: string) {
  const client = buildFpClient(affiliateToken);
  try {
    const { data } = await client.get('/promoters/me');
    return data;
  } catch (err) {
    throw normalizeFpError(err);
  }
}

export async function getReferrals(affiliateToken: string, params?: Record<string, string>) {
  const client = buildFpClient(affiliateToken);
  try {
    const { data } = await client.get('/referrals', { params });
    return data;
  } catch (err) {
    throw normalizeFpError(err);
  }
}

export async function getCommissions(affiliateToken: string, params?: Record<string, string>) {
  const client = buildFpClient(affiliateToken);
  try {
    const { data } = await client.get('/commissions', { params });
    return data;
  } catch (err) {
    throw normalizeFpError(err);
  }
}

export async function getPayouts(affiliateToken: string, params?: Record<string, string>) {
  const client = buildFpClient(affiliateToken);
  try {
    const { data } = await client.get('/payouts', { params });
    return data;
  } catch (err) {
    throw normalizeFpError(err);
  }
}

export async function getPromoCodes(affiliateToken: string) {
  const client = buildFpClient(affiliateToken);
  try {
    const { data } = await client.get('/promo_codes');
    return data;
  } catch (err) {
    throw normalizeFpError(err);
  }
}

export async function getReferralLinks(affiliateToken: string) {
  const client = buildFpClient(affiliateToken);
  try {
    const { data } = await client.get('/referral_links');
    return data;
  } catch (err) {
    throw normalizeFpError(err);
  }
}

export async function getCampaigns(affiliateToken: string) {
  const client = buildFpClient(affiliateToken);
  try {
    const { data } = await client.get('/campaigns');
    return data;
  } catch (err) {
    throw normalizeFpError(err);
  }
}

export async function getReports(affiliateToken: string, params?: Record<string, string>) {
  const client = buildFpClient(affiliateToken);
  try {
    const { data } = await client.get('/reports', { params });
    return data;
  } catch (err) {
    throw normalizeFpError(err);
  }
}

export async function loginAffiliate(email: string, password: string) {
  // FP v2 affiliate login — returns auth_token used for subsequent calls
  const client = axios.create({
    baseURL: FP_BASE_URL,
    headers: {
      Authorization: `Bearer ${process.env.FIRSTPROMOTER_API_KEY}`,
      'X-Api-Account': process.env.FIRSTPROMOTER_ACCOUNT_ID ?? '',
      'Content-Type': 'application/json',
    },
    timeout: 10_000,
  });
  try {
    const { data } = await client.post('/auth/sign_in', { email, password });
    return data;
  } catch (err) {
    throw normalizeFpError(err);
  }
}
