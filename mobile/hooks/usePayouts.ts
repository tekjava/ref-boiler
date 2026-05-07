import { useQuery } from '@tanstack/react-query';
import { fetchPayouts } from '../services/api';

export function usePayouts() {
  return useQuery({ queryKey: ['affiliate', 'payouts'], queryFn: () => fetchPayouts() });
}
