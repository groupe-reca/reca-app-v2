import { useQuery } from '@tanstack/react-query'
import { dependencies } from '@/app/dependencies'
import type { LeadId } from '../domain/lead.types'
import { leadKeys } from './leadKeys'

export function useLead(id: LeadId | undefined) {
  return useQuery({
    queryKey: leadKeys.detail(id ?? ''),
    queryFn: () => dependencies.leadRepository.getById(id ?? ''),
    enabled: Boolean(id),
  })
}
