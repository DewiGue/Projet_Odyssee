import { useQuery } from '@tanstack/react-query'
import { api } from '../api/client'

export function useTypes() {
  return useQuery({
    queryKey: ['types'],
    queryFn: () => api('/types'),
  })
}