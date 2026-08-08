import { useMutation, useQueryClient } from '@tanstack/react-query'
import { dependencies } from '@/app/dependencies'
import type { LeadStatus } from '@/domain/leadStatus'
import type { LeadId } from '../domain/lead.types'
import { leadKeys } from './leadKeys'

export function useUpdateLeadStatus(id: LeadId) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (status: LeadStatus) => dependencies.leadRepository.updateStatus(id, status),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: leadKeys.detail(id) })
      void queryClient.invalidateQueries({ queryKey: leadKeys.list() })
    },
  })
}
