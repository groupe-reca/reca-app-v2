import { useQuery } from '@tanstack/react-query'
import { dependencies } from '@/app/dependencies'
import { clientKeys } from './clientKeys'

export function useClients() {
  return useQuery({
    queryKey: clientKeys.list(),
    queryFn: () => dependencies.clientRepository.listSummaries(),
  })
}
