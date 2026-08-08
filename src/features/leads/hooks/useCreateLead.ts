import { useMutation, useQueryClient } from '@tanstack/react-query'
import { dependencies } from '@/app/dependencies'
import type { CreateLeadInput } from '../domain/lead.types'
import { leadKeys } from './leadKeys'

export function useCreateLead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateLeadInput) => dependencies.leadRepository.create(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: leadKeys.list() })
    },
  })
}
