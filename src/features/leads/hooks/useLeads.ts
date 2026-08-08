import { useQuery } from '@tanstack/react-query'
import { dependencies } from '@/app/dependencies'
import { leadKeys } from './leadKeys'

export function useLeads() {
  return useQuery({
    queryKey: leadKeys.list(),
    queryFn: () => dependencies.leadRepository.listSummaries(),
  })
}
