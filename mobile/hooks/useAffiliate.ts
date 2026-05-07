import { useQuery } from '@tanstack/react-query';
import { fetchMe, fetchReferralLinks, fetchReports } from '../services/api';

export function useAffiliate() {
  return useQuery({ queryKey: ['affiliate', 'me'], queryFn: fetchMe });
}

export function useReferralLinks() {
  return useQuery({ queryKey: ['affiliate', 'referral-links'], queryFn: () => fetchReferralLinks() });
}

export function useReports() {
  return useQuery({ queryKey: ['affiliate', 'reports'], queryFn: () => fetchReports() });
}
