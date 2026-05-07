import axios from 'axios';
import { MIDDLEWARE_BASE_URL } from '../constants/config';
import { getToken } from '../store/authStore';

const client = axios.create({ baseURL: MIDDLEWARE_BASE_URL });

client.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function login(email: string, password: string): Promise<string> {
  const { data } = await client.post<{ token: string }>('/auth/login', { email, password });
  return data.token;
}

export async function fetchMe() {
  const { data } = await client.get('/affiliate/me');
  return data;
}

export async function fetchReferrals(params?: Record<string, string>) {
  const { data } = await client.get('/affiliate/referrals', { params });
  return data;
}

export async function fetchCommissions(params?: Record<string, string>) {
  const { data } = await client.get('/affiliate/commissions', { params });
  return data;
}

export async function fetchPayouts(params?: Record<string, string>) {
  const { data } = await client.get('/affiliate/payouts', { params });
  return data;
}

export async function fetchPromoCodes() {
  const { data } = await client.get('/affiliate/promo-codes');
  return data;
}

export async function fetchReferralLinks() {
  const { data } = await client.get('/affiliate/referral-links');
  return data;
}

export async function fetchCampaigns() {
  const { data } = await client.get('/affiliate/campaigns');
  return data;
}

export async function fetchReports(params?: Record<string, string>) {
  const { data } = await client.get('/affiliate/reports', { params });
  return data;
}
