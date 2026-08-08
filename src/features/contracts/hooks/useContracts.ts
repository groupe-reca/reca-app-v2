import { useQuery } from '@tanstack/react-query'
import { dependencies } from '@/app/dependencies'
import { contractKeys } from './contractKeys'

export function useContracts() {
  return useQuery({
    queryKey: contractKeys.list(),
    queryFn: () => dependencies.contractRepository.listSummaries(),
  })
}
