import { useQuery } from '@tanstack/react-query'
import { api } from '../api/client'

export function usePlants() {
  return useQuery({
    queryKey: ['plants'],
    queryFn: () => api('/plants'),
  })
}