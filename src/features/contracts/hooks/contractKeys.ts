import type { ContractId } from '../domain/contract.types'

export const contractKeys = {
  all: ['contracts'] as const,
  lists: () => [...contractKeys.all, 'list'] as const,
  list: () => [...contractKeys.lists()] as const,
  details: () => [...contractKeys.all, 'detail'] as const,
  detail: (id: ContractId) => [...contractKeys.details(), id] as const,
}
