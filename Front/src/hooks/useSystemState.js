import { useQuery } from '@tanstack/react-query'
import { api } from '../api/client'

export function useSystemState() {
  return useQuery({
    queryKey: ['state'],
    queryFn: () => api('/state'),
    refetchInterval: 1000,
  })
}