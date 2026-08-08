import { useQuery } from '@tanstack/react-query'
import { dependencies } from '@/app/dependencies'
import type { ClientId } from '../domain/client.types'
import { clientKeys } from './clientKeys'

export function useClient(id: ClientId | undefined) {
  return useQuery({
    queryKey: clientKeys.detail(id ?? ''),
    queryFn: () => dependencies.clientRepository.getById(id ?? ''),
    enabled: Boolean(id),
  })
}
