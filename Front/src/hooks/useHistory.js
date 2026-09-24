import { useQuery } from '@tanstack/react-query'
import { api } from '../api/client'

export function useHistory(limit = 300) {
  return useQuery({
    queryKey: ['history', limit],
    queryFn: () => api(`/history?limit=${limit}`),
    refetchInterval: 5000,
  })
}