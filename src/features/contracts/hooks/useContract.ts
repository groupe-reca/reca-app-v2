import { useQuery } from '@tanstack/react-query'
import { dependencies } from '@/app/dependencies'
import type { ContractId } from '../domain/contract.types'
import { contractKeys } from './contractKeys'

export function useContract(id: ContractId | undefined) {
  return useQuery({
    queryKey: contractKeys.detail(id ?? ''),
    queryFn: () => dependencies.contractRepository.getById(id ?? ''),
    enabled: Boolean(id),
  })
}
