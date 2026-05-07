import { useQuery } from '@tanstack/react-query';
import { fetchCommissions } from '../services/api';

export function useCommissions() {
  return useQuery({ queryKey: ['affiliate', 'commissions'], queryFn: () => fetchCommissions() });
}
